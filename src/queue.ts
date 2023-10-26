import q from "queue";
import { env } from "./env.js";

export interface Options {
  concurrency?: number;
  maxWaiting?: number;
  timeout?: number;
}

interface Job {
  (): Promise<void>;
  cancel: (reason?: any) => void;
  ref: Job;
}

export class TimeoutError extends Error {
  name: "TimeoutError";
}

export class CancelledError extends Error {
  name: "CancelledError";
}

export class OverfilledError extends Error {
  name: "OverfilledError";
}

const createJob = (
  run: () => Promise<any>,
  cancel: (reason?: any) => void
): [Job, Promise<any>] => {
  let _reject = (reason?: any) => {};
  let _resolve = (value: any) => {};

  const promise = new Promise<any>((resolve, reject) => {
    _resolve = (r) => {
      resolve(r);
    };
    _reject = (r) => {
      reject(r);
    };
  });

  const job: Job = async function () {
    try {
      const value = await run();
      _resolve(value);
    } catch (err) {
      _reject(err);
      throw err;
    }
  };

  job.cancel = (reason) => {
    cancel(reason);
    _reject(reason);
  };
  job.ref = job;

  return [job, promise];
};

class Queue {
  #queue = new q({
    autostart: true,
  });

  #options: Options = {};

  constructor(options?: Options) {
    this.#options = options || {};
    this.#queue.concurrency = options?.concurrency || 0;
    this.#queue.timeout = options?.timeout||60_000;

    this.#queue.addEventListener("timeout", (e) => {
      const job = e.detail.job as unknown as Job;
      job.cancel(new TimeoutError());
    });
  }

  #deleteJob(job: Job) {
    const foundIndex = this.#queue.indexOf(job);

    job.cancel(new CancelledError());

    if (foundIndex !== -1) {
      this.#queue.splice(foundIndex, 1);
    }
  }

  get length() {
    return this.#queue.length;
  }

  get maxWaiting() {
    return this.#options.maxWaiting || 0;
  }

  get maxJobs() {
    return this.maxWaiting + this.#queue.concurrency;
  }

  get isAddAllowed() {
    return this.length < this.maxJobs;
  }

  add<T = unknown>(
    fn: () => Promise<T>,
    cancel: () => void
  ): [Promise<T>, () => void] {
    if (!this.isAddAllowed) {
      return [Promise.reject(new OverfilledError()), () => {}];
    }

    const [job, promise] = createJob(fn, cancel);

    this.#queue.push(job);

    return [
      promise,
      () => {
        this.#deleteJob(job);
      },
    ];
  }
}

export const queue = new Queue({
  timeout: env.jobTimeout,
  maxWaiting: env.maxQueueLength,
  concurrency: env.maxParallelSessions,
});
