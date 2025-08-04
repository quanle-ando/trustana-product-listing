/**
 * Ref https://ant.design/docs/react/server-side-rendering
 */
import fs from "fs";
import { extractStyle } from "@ant-design/static-style-extract";

const outputPath = "src/app/antd.min.css";

const css = extractStyle();

fs.writeFileSync(outputPath, css);
