import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setJpegQuality(100);
Config.setOverwriteOutput(true);
Config.setEntryPoint("./remotion/index.ts");
