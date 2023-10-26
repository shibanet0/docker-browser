// import adblockRust from "adblock-rs";
// import { dirname, join } from "path";
// import { fileURLToPath } from "url";
// import promises from "fs/promises";
// import fs from "fs";

// const debugInfo = true;
// const filterSet = new adblockRust.FilterSet(debugInfo);

// const dataPath = join(
//   dirname(fileURLToPath(import.meta.url)),
//   "../ublock/data/"
// );

// const cache = join(dataPath, "cache");

// if (!fs.existsSync(cache)) {
//   const resourceList = [
//     "https://raw.githubusercontent.com/brave/adblock-rust/master/data/brave/brave-unbreak.txt",
//     "https://raw.githubusercontent.com/brave/adblock-rust/master/data/brave/coin-miners.txt",
//     "https://raw.githubusercontent.com/brave/adblock-rust/master/data/uBlockOrigin/unbreak.txt",
//     "https://easylist.to/easylist/easylist.txt",
//     "https://easylist-downloads.adblockplus.org/ruadlist.txt",

//     "https://adguardteam.github.io/HostlistsRegistry/assets/filter_1.txt",
//     "https://adguardteam.github.io/HostlistsRegistry/assets/filter_2.txt",
//     "https://adguardteam.github.io/HostlistsRegistry/assets/filter_12.txt",
//     "https://adguardteam.github.io/HostlistsRegistry/assets/filter_24.txt",
//     "https://adguardteam.github.io/HostlistsRegistry/assets/filter_10.txt",
//     "https://adguardteam.github.io/HostlistsRegistry/assets/filter_8.txt",
//     "https://adguardteam.github.io/HostlistsRegistry/assets/filter_31.txt",
//     "https://adguardteam.github.io/HostlistsRegistry/assets/filter_30.txt",
//     "https://adguardteam.github.io/HostlistsRegistry/assets/filter_9.txt",
//     "https://adguardteam.github.io/HostlistsRegistry/assets/filter_11.txt",
//     "https://adguardteam.github.io/HostlistsRegistry/assets/filter_16.txt",
//     "https://adguardteam.github.io/HostlistsRegistry/assets/filter_17.txt",
//     "https://adguardteam.github.io/HostlistsRegistry/assets/filter_26.txt",
//     "https://adguardteam.github.io/HostlistsRegistry/assets/filter_14.txt",
//     "https://adguardteam.github.io/HostlistsRegistry/assets/filter_13.txt",
//     "https://adguardteam.github.io/HostlistsRegistry/assets/filter_20.txt",
//     "https://adguardteam.github.io/HostlistsRegistry/assets/filter_36.txt",
//     "https://adguardteam.github.io/HostlistsRegistry/assets/filter_15.txt",
//     "https://adguardteam.github.io/HostlistsRegistry/assets/filter_25.txt",
//     "https://adguardteam.github.io/HostlistsRegistry/assets/filter_18.txt",
//     "https://adguardteam.github.io/HostlistsRegistry/assets/filter_19.txt",
//     "https://adguardteam.github.io/HostlistsRegistry/assets/filter_22.txt",
//     "https://adguardteam.github.io/HostlistsRegistry/assets/filter_35.txt",
//     "https://adguardteam.github.io/HostlistsRegistry/assets/filter_29.txt",
//     "https://adguardteam.github.io/HostlistsRegistry/assets/filter_21.txt",
//     "https://adguardteam.github.io/HostlistsRegistry/assets/filter_23.txt",
//     "https://adguardteam.github.io/HostlistsRegistry/assets/filter_7.txt",
//     "https://adguardteam.github.io/HostlistsRegistry/assets/filter_6.txt",
//     "https://adguardteam.github.io/HostlistsRegistry/assets/filter_33.txt",
//     "https://adguardteam.github.io/HostlistsRegistry/assets/filter_3.txt",
//     "https://adguardteam.github.io/HostlistsRegistry/assets/filter_27.txt",
//     "https://adguardteam.github.io/HostlistsRegistry/assets/filter_5.txt",
//     "https://adguardteam.github.io/HostlistsRegistry/assets/filter_32.txt",
//     "https://adguardteam.github.io/HostlistsRegistry/assets/filter_34.txt",
//     "https://adguardteam.github.io/HostlistsRegistry/assets/filter_4.txt",
//     "https://adguardteam.github.io/HostlistsRegistry/assets/filter_38.txt",
//   ];

//   for (const adlist of resourceList) {
//     const u = new URL(adlist);
//     const filePath = u.pathname.split("/");
//     const fileName = filePath[filePath.length - 1];
//     const file = join(dataPath, fileName);

//     const fileExists = !!(await promises.stat(file).catch((_) => false));

//     if (!fileExists) {
//       try {
//         console.log("adlist", adlist);
//         const req = await fetch(adlist);
//         const adFilter = await req.text();

//         if (adFilter) {
//           await promises.writeFile(file, adFilter);
//           filterSet.addFilters(adFilter.split("\n"));
//         }
//       } catch (e) {
//         console.error(e);
//       }
//     }

//     const adFilter = await promises.readFile(file, {
//       encoding: "utf-8",
//     });

//     filterSet.addFilters(adFilter.split("\n"));
//   }
// }

// function toBuffer(arrayBuffer: any) {
//   const buffer = Buffer.alloc(arrayBuffer.byteLength);
//   const view = new Uint8Array(arrayBuffer);
//   for (let i = 0; i < buffer.length; ++i) {
//     buffer[i] = view[i];
//   }
//   return buffer;
// }

// let engine: adblockRust.Engine;

// function toArrayBuffer(buffer: any) {
//   const arrayBuffer = new ArrayBuffer(buffer.length);
//   const view = new Uint8Array(arrayBuffer);
//   for (let i = 0; i < buffer.length; ++i) {
//     view[i] = buffer[i];
//   }
//   return arrayBuffer;
// }

// if (fs.existsSync(cache)) {
//   engine = new adblockRust.Engine(filterSet, true);
//   engine.deserialize(toArrayBuffer(fs.readFileSync(cache)));

  
// } else {
//   engine = new adblockRust.Engine(filterSet, true);
//   // engine.useResources(resources);
//   // Serialize the engine to an ArrayBuffer
//   const serializedArrayBuffer = engine.serializeRaw();
//   console.log(
//     `Engine size: ${(serializedArrayBuffer.byteLength / 1024 / 1024).toFixed(
//       2
//     )} MB`
//   );
//   fs.writeFileSync(cache, toBuffer(serializedArrayBuffer));
// }

// export const check = (
//   url: string,
//   source_url: string,
//   request_type: string,
//   debug?: boolean | undefined
// ) => engine.check(url, source_url, request_type, debug);


export const check = (
  url: string,
  source_url: string,
  request_type: string,
  debug?: boolean | undefined
) => false