import spawn from "@expo/spawn-async"
import fs from "fs"
import path from "path"
import { toHtml } from "hast-util-to-html"

import { BuildCtx } from "../../util/ctx"
import { Root as HTMLRoot } from "hast"
import { QuartzTransformerPlugin } from "../types"
import { VFile } from "vfile"

const quartzCache = path.resolve("./quartz/.quartz-cache/password/")
const customTemplatePath = path.resolve(`./quartz/static/password_page.html`)

export async function encryptPages() {
  const ppath = path.join(quartzCache, "cache.json")
  const passwordCache: { password: string; savePath: string }[] = fs.existsSync(ppath)
    ? JSON.parse(fs.readFileSync(ppath, "utf-8"))
    : []
  for (const file of passwordCache) {
    // https://github.com/robinmoisson/staticrypt/blob/27a564ac611e01f0b3589e56eb36df1f8b54381d/cli/helpers.js
    // see above about the various options you can pass in to the below
    await spawn("npx", [
      "staticrypt",
      file.savePath,
      "-p",
      file.password,
      "--short",
      "-d",
      path.dirname(file.savePath),
      "--template",
      customTemplatePath,
      "--config", "false",
      "--template-title", "For DM's eyes only!",
      "--template-color-secondary", "#dde2d5",
      "--template-instructions", "Enter password below!<br/><small>Hit Refresh/F5 if it looks wonky :3</small>" ,
      "--template-error", "That password was incorrect.",
      "--template-button", "Reveal secrets 👁️"
    ])
  }
  // Little cute delay :3
  await setTimeout(() => {}, 100)
}

interface Options {
  /*** The description of every password-protected notes */
  lockedDescription?: string
}

// Clears the password directory
const passwordCache = path.resolve("./quartz/.quartz-cache/password/cache.json")
fs.rmSync(quartzCache, { recursive: true, force: true })

export const Staticrypt: QuartzTransformerPlugin<Options> = (opts?: Options) => {
  return {
    name: "Staticrypt",
    htmlPlugins(ctx: BuildCtx) {
      return [
        () => {
          return async (tree: HTMLRoot, file: VFile) => {
            const savePath = path.join(quartzCache, ctx.argv.output, `${file.data.slug}.html`)
            const frontmatter = file.data.frontmatter

            file.data.isProtected = false
            if (frontmatter && "password" in frontmatter && frontmatter.password) {
              if (!fs.existsSync(quartzCache)) {
                fs.mkdirSync(quartzCache, { recursive: true })
              }
              file.data.isProtected = true

              // Password cache
              let currentCache: { password: string; savePath: string }[] = []
              if (!fs.existsSync(passwordCache)) {
                fs.writeFileSync(passwordCache, "[]")
              } else {
                currentCache = JSON.parse(fs.readFileSync(passwordCache, "utf-8"))
              }

              currentCache.push({
                password: frontmatter.password as string,
                savePath: path.join(ctx.argv.output, `${file.data.slug}.html`),
              })
              fs.writeFileSync(passwordCache, JSON.stringify(currentCache))

              fs.mkdirSync(path.dirname(savePath), { recursive: true })
              fs.writeFileSync(savePath, toHtml(tree))
              
              file.data.description = opts?.lockedDescription || "This note is password-protected."
            }
          }
        },
      ]
    },
  }
}

declare module "vfile" {
  interface DataMap {
    isProtected: boolean
  }
}