import multiparty from "multiparty";

export default async function handler(req, res) {
  const form = new multiparty.Form();
  try {
    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve({ fields, files });
      });
    });

    console.log("Files uploaded: ", files.file?.length);
    return res.status(200).json({ mess: "ok" });
  } catch (err) {
    console.error("Error while parsing the form:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

export const config = {
  api: { bodyParser: false },
};
