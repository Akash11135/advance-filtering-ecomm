import multiparty from "multiparty";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import fs from "fs";
import mime from "mime-types";
export default async function handler(req, res) {
  const bucketName = "akash-next";
  const form = new multiparty.Form();
  try {
    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve({ fields, files });
      });
    });

    //create an s3 client connection
    const client = new S3Client({
      region: "ap-south-1",
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
      },
    });
    const links = [];
    for (const file of files?.file) {
      const extension = file.originalFilename.split(".").pop();
      const newFilename = Date.now() + "." + extension; //to reduce ambiguity

      //send data to s3 client
      await client.send(
        new PutObjectCommand({
          Bucket: bucketName,
          Key: newFilename,
          Body: fs.readFileSync(file.path),
          ACL: "public-read",
          ContentType: mime.lookup(file.path),
        })
      );
      const link = `https://${bucketName}.s3.amazonaws.com/${newFilename}`;
      links.push(link);
    }

    return res.status(200).json({ links });
  } catch (err) {
    console.error("Error while parsing the form:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

export const config = {
  api: { bodyParser: false },
};
