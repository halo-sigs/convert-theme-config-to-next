# @halo-dev/convert-theme-config-to-next

将 Halo 1.5 的主题配置自动转换为 Halo 2.0 适用的主题配置。

## 使用

### theme.yaml

```bash
npx @halo-dev/convert-theme-config-to-next theme -i path/to/theme.yaml
```

或者

```bash
cd path/to/theme

npx @halo-dev/convert-theme-config-to-next theme
```

转换完成之后需要修改 `metadata.name` `spec.settingName` `spec.configMapName`。

### settings.yaml

```bash
npx @halo-dev/convert-theme-config-to-next settings -i path/to/settings.yaml
```

或者

```bash
cd path/to/theme

npx @halo-dev/convert-theme-config-to-next settings
```

转换完成之后需要修改 `metadata.name`。
