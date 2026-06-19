import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export const uploadVideoToCloudinary = (buffer: Buffer): Promise<string> => {
  // return new Promise((resolve, reject) => {
  //   let chunkNumber = 0;
  //   const stream = cloudinary.uploader.upload_chunked_stream(
  //     {
  //       resource_type: "video",
  //       folder: "VedioStreamer",
  //       chunk_size: 5 * 1024 * 1024,
  //     },
  //     (error, result) => {
  //       if (error) reject(error);
  //       else resolve(result?.secure_url as string);
  //     },
  //   );
  //   stream.on("drain", () => {
  //     chunkNumber++;
  //     console.log(`chunk ${chunkNumber} uploaded to cloudinary`);
  //   });
  //   stream.on("finish", () => {
  //     console.log("All chunks uploaded successfylly");
  //   });

  //   stream.on("error", (err) => {
  //     console.log("Stream error ", err);
  //   });

  //   const readStreamPipe = streamifier.createReadStream(buffer).pipe(stream);

  //   console.log(readStreamPipe);
    
  //   const readStream = streamifier.createReadStream(buffer, {
  //     highWaterMark: 5 * 1024 * 10124,
  //   });
  //   readStream.on("data", (chunk) => {
  //     chunkNumber++;
  //     console.log(`chunk ${chunkNumber} sending size: ${chunk.length} bytes`);
  //   });

  //   readStream.on("end", () => {
  //     console.log(`Total chunk sent : ${chunkNumber}`);
  //   });

  //   readStream.pipe(stream);
  // });
  return new Promise((resolve, reject) => {
  cloudinary.uploader.upload_chunked_stream(
    { resource_type: "video", folder: "VedioStreamer", chunk_size: 5 * 1024 * 1024 },
    (error, result) => error ? reject(error) : resolve(result?.secure_url as string)
  ).end(buffer);
});
};
