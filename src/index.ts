// Documentation: https://sdk.netlify.com/docs
import { NetlifyExtension } from "@netlify/sdk";


const extension = new NetlifyExtension();

extension.addBuildEventHandler("onPreBuild", () => {
  // If the build event handler is not enabled, return early
  if (!process.env["NETLIFY_GITHUB_STATUS_EXTENSION_ENABLED"]) {
    return;
  }
  console.log("Hello there.");
});
  
export { extension };

