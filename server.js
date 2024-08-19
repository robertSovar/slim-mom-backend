import app from "./app.js";

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server is running. Use our API on port: ${port}`);
});
