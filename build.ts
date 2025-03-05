import { spawn, ChildProcess } from "child_process"
import { build, Platform, context, PluginBuild, BuildContext } from "esbuild"

const isWatch = process.argv.includes("--watch")
const isProd = process.env.NODE_ENV === "production"
const outDir = "dist"

let serverProcess: ChildProcess | null = null
let watchContext: BuildContext | null = null

const buildOptions = {
  entryPoints: ["src/index.ts"],
  bundle: true,
  outdir: outDir,
  platform: "node" as Platform,
  sourcemap: !isProd,
  minify: isProd,
  tsconfig: "tsconfig.json",
  define: {
    "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV || "development"),
  }
}

const plugins = [{
  name: "on-build",
  setup(build: PluginBuild) {
    build.onStart(() => console.log(`🛠️ Building ${isProd ? "for production" : "in development mode"}...`))
    build.onEnd(() => {
      console.log("✅ Build completed successfully!\n")
      //startServer() // Uncomment this line to start the server after each build, TODO: uncomment this line when index.ts will start a server and not just a script
    })
  }
}]

const startServer = () => {
  if (serverProcess) {
    console.log("🔄 Killing previous process...")
    serverProcess.kill("SIGTERM")
  }
  console.log("🚀 Starting the built file...")
  serverProcess = spawn("node", ["dist/index.js"], { stdio: "inherit", shell: true })

  serverProcess.on("exit", (code) => {
    if (code !== null) {
      console.log(`📌 Process exited with code: ${code}\n`)
    }
    serverProcess = null
  })
}

process.on("SIGINT", () => {
  console.log("\n🛑 Received SIGINT. Exiting...")
  serverProcess?.kill("SIGTERM")
  watchContext?.dispose()
  process.exit(0)
})

process.on("SIGTERM", () => {
  console.log("\n🛑 Received SIGTERM. Exiting...")
  serverProcess?.kill("SIGTERM")
  watchContext?.dispose()
  process.exit(0)
})


const runBuild = async() => {
  try {

    if (isWatch) {
      console.log("👀 Watch mode enabled...\n")
      watchContext = await context({ ...buildOptions, plugins })
      await watchContext.watch()
      
    } else {
      await build({ ...buildOptions, plugins })

    }
  } catch (error) {
    console.error("❌ Build failed:", error)
    process.exit(1)
  }
}

runBuild()