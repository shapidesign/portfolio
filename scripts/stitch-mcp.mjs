/**
 * MCP stdio bridge to Google Stitch (proxies Stitch remote tools for Cursor).
 * Configured in .cursor/mcp.json — do not run interactively.
 */
import { StitchProxy } from "@google/stitch-sdk";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const proxy = new StitchProxy({
  name: "stitch",
  version: "1.0.0",
});

const transport = new StdioServerTransport();
await proxy.start(transport);
