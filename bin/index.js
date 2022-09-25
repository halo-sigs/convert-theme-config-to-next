#!/usr/bin/env node

const { Command } = require("commander");
const yaml = require("yaml");
const path = require("path");
const fs = require("fs");

const program = new Command();

program
  .name("@halo-dev/convert-theme-config-to-next")
  .description("将 Halo 1.5 主题配置转换为 Halo 2.0 主题配置")
  .version("0.0.0");

program
  .command("theme")
  .description("转换 1.5 theme.yaml 配置为 2.0 配置")
  .option("-i, --input <char>", "theme.yaml 配置文件路径")
  .action((str, options) => {
    const input = options.input || path.resolve(process.cwd(), "theme.yaml");

    if (!fs.existsSync(input)) {
      console.log("theme.yaml 配置文件不存在");
      return;
    }

    const yamlContent = fs.readFileSync(path.resolve(input), "utf-8");

    const themeConfig = yaml.parse(yamlContent);

    const theme = {
      apiVersion: "theme.halo.run/v1alpha1",
      kind: "Theme",
      spec: {
        displayName: themeConfig.name,
        author: {
          name: themeConfig.author.name,
          website: themeConfig.author.website,
        },
        description: themeConfig.description,
        logo: themeConfig.logo,
        website: themeConfig.website,
        repo: themeConfig.repo,
        settingName: "<replace-setting-name>",
        configMapName: "<replace-configMap-name>",
        version: "0.0.0",
        require: "2.0",
      },
      metadata: {
        name: "<replace-name>",
      },
    };

    const output = path.resolve(process.cwd(), "theme.2.0.yaml");

    fs.writeFileSync(output, yaml.stringify(theme));

    console.log(`已生成 theme.2.0.yaml 文件，路径为：${output}`);
  });

program
  .command("settings")
  .description("转换 1.5 settings.yaml 配置为 2.0 配置")
  .option("-i, --input <char>", "settings.yaml 配置文件绝对路径")
  .action((_, options) => {
    const input = options.input || path.resolve(process.cwd(), "settings.yaml");

    if (!fs.existsSync(input)) {
      console.log("settings.yaml 配置文件不存在");
      return;
    }

    const yamlContent = fs.readFileSync(path.resolve(input), "utf-8");

    const themeSetting = yaml.parse(yamlContent);

    const setting = {
      apiVersion: "v1alpha1",
      kind: "Setting",
      metadata: {
        name: "<replace-setting-name>",
      },
      spec: {
        forms: [],
      },
    };

    for (const key in themeSetting) {
      const form = {};
      const group = themeSetting[key];
      form.group = key;
      form.label = group.label;

      form.formSchema = Object.keys(group.items).map((itemKey) => {
        const item = group.items[itemKey];

        const formSchema = {
          $formkit: "text",
          name: item.name,
          label: item.label,
          placeholder: item.placeholder,
          value: item.default,
          help: item.description,
        };

        if (["text", "attachment"].includes(item.type)) {
          formSchema.$formkit = "text";
        }

        if (["textarea", "color", "number"].includes(item.type)) {
          formSchema.$formkit = item.type;
        }

        if (["select", "radio"].includes(item.type)) {
          formSchema.$formkit = item.type;
          formSchema.options = item.options;
        }

        if (item.type === "switch") {
          formSchema.$formkit = "radio";
          formSchema.options = item.options;
        }
        return formSchema;
      });

      setting.spec.forms.push(form);
    }

    const output = path.resolve(process.cwd(), "settings.2.0.yaml");

    fs.writeFileSync(output, yaml.stringify(setting));

    console.log(`已生成 setting.2.0.yaml 文件，路径为：${output}`);
  });

program.parse();
