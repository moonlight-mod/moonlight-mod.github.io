// Copied from moonlight itself
export const apiLevel = 2;

export enum ExtensionTag {
  Accessibility = "accessibility",
  Appearance = "appearance",
  Chat = "chat",
  Commands = "commands",
  ContextMenu = "contextMenu",
  DangerZone = "dangerZone",
  Development = "development",
  Fixes = "fixes",
  Fun = "fun",
  Markdown = "markdown",
  Voice = "voice",
  Privacy = "privacy",
  Profiles = "profiles",
  QualityOfLife = "qol",
  Library = "library"
}

export type ExtensionAuthor =
  | string
  | {
      name: string;
      id?: string;
    };

export type ExtensionManifest = {
  $schema?: string;

  /**
   * A unique identifier for your extension.
   */
  id: string;

  /**
   * A version string for your extension - doesn't need to follow a specific format. Required for publishing.
   */
  version?: string;

  /**
   * The API level this extension targets. If it does not match the current version, the extension will not be loaded.
   */
  apiLevel?: number;

  /**
   * Which environment this extension is capable of running in.
   */
  environment?: ExtensionEnvironment;

  /**
   * Metadata about your extension for use in Moonbase.
   */
  meta?: {
    /**
     * A human friendly name for your extension as a proper noun.
     */
    name?: string;

    /**
     * A short tagline that appears below the name.
     */
    tagline?: string;

    /**
     * A longer description that can use Markdown.
     */
    description?: string;

    /**
     * List of authors that worked on this extension - accepts string or object with ID.
     */
    authors?: ExtensionAuthor[];

    /**
     * A list of tags that are relevant to the extension.
     */
    tags?: ExtensionTag[];

    /**
     * The URL to the source repository.
     */
    source?: string;

    /**
     * A donation link (or other method of support). If you don't want financial contributions, consider putting your favorite charity here!
     */
    donate?: string;

    /**
     * A changelog to show in Moonbase.
     * Moonbase will show the changelog for the latest version, even if it is not installed.
     */
    changelog?: string;

    /**
     * Whether the extension is deprecated and no longer receiving updates.
     */
    deprecated?: boolean;
  };

  /**
   * A list of extension IDs that are required for the extension to load.
   */
  dependencies?: string[];

  /**
   * A list of extension IDs that the user may want to install.
   */
  suggested?: string[];

  /**
   * A list of extension IDs that the extension is incompatible with.
   * If two incompatible extensions are enabled, one of them will not load.
   */
  incompatible?: string[];

  /**
   * A list of settings for your extension, where the key is the settings ID.
   */
  settings?: Record<string, ExtensionSettingsManifest>;

  /**
   * A list of URLs to bypass CORS for.
   * This is implemented by checking if the start of the URL matches.
   * @example https://moonlight-mod.github.io/
   */
  cors?: string[];

  /**
   * A list of URLs to block all requests to.
   * This is implemented by checking if the start of the URL matches.
   * @example https://moonlight-mod.github.io/
   */
  blocked?: string[];

  /**
   * A mapping from CSP directives to URLs to allow.
   * @example { "script-src": ["https://example.com"] }
   */
  csp?: Record<string, string[]>;

  download?: string;
};

export enum ExtensionSettingType {
  Boolean = "boolean",
  Number = "number",
  String = "string",
  MultilineString = "multilinestring",
  Select = "select",
  MultiSelect = "multiselect",
  List = "list",
  Dictionary = "dictionary",
  Custom = "custom"
}

export type SelectOption =
  | string
  | {
      value: string;
      label: string;
    };

export type BooleanSettingType = {
  /**
   * Displays as a simple switch.
   */
  type: ExtensionSettingType.Boolean;
  default?: boolean;
};

export type NumberSettingType = {
  /**
   * Displays as a simple slider.
   */
  type: ExtensionSettingType.Number;
  default?: number;
  min?: number;
  max?: number;
};

export type StringSettingType = {
  /**
   * Displays as a single line string input.
   */
  type: ExtensionSettingType.String;
  default?: string;
};

export type MultilineTextInputSettingType = {
  /**
   * Displays as a multiple line string input.
   */
  type: ExtensionSettingType.MultilineString;
  default?: string;
};

export type SelectSettingType = {
  /**
   * A dropdown to pick between one of many values.
   */
  type: ExtensionSettingType.Select;
  options: SelectOption[];
  default?: string;
};

export type MultiSelectSettingType = {
  /**
   * A dropdown to pick multiple values.
   */
  type: ExtensionSettingType.MultiSelect;
  options: string[];
  default?: string[];
};

export type ListSettingType = {
  /**
   * A list of strings that the user can add or remove from.
   */
  type: ExtensionSettingType.List;
  default?: string[];
};

export type DictionarySettingType = {
  /**
   * A dictionary (key-value pair) that the user can add or remove from.
   */
  type: ExtensionSettingType.Dictionary;
  default?: Record<string, string>;
};

export type CustomSettingType = {
  /**
   * A custom component.
   * You can use the registerConfigComponent function in the Moonbase API to register a React component to render here.
   */
  type: ExtensionSettingType.Custom;
  default?: any;
};

export enum ExtensionSettingsAdvice {
  None = "none",
  Reload = "reload",
  Restart = "restart"
}

export type ExtensionSettingsManifest = {
  /**
   * A human friendly name for the setting.
   */
  displayName?: string;

  /**
   * A longer description for the setting.
   * Markdown is not supported.
   */
  description?: string;

  /**
   * The "advice" to give upon changing this setting.
   * Can be configured to reload the client, restart the client, or do nothing.
   */
  advice?: ExtensionSettingsAdvice;
} & (
  | BooleanSettingType
  | NumberSettingType
  | StringSettingType
  | MultilineTextInputSettingType
  | SelectSettingType
  | MultiSelectSettingType
  | ListSettingType
  | DictionarySettingType
  | CustomSettingType
);

export enum ExtensionEnvironment {
  /**
   * The extension will run on both platforms, the host/native modules MAY be loaded
   */
  Both = "both",

  /**
   * Extension will run on desktop only, the host/native modules are guaranteed to load
   */
  Desktop = "desktop",

  /**
   * Currently equivalent to Both
   */
  Web = "web"
}

export const tagNames: Record<ExtensionTag, string> = {
  [ExtensionTag.Accessibility]: "Accessibility",
  [ExtensionTag.Appearance]: "Appearance",
  [ExtensionTag.Chat]: "Chat",
  [ExtensionTag.Commands]: "Commands",
  [ExtensionTag.ContextMenu]: "Context Menu",
  [ExtensionTag.DangerZone]: "Danger Zone",
  [ExtensionTag.Development]: "Development",
  [ExtensionTag.Fixes]: "Fixes",
  [ExtensionTag.Fun]: "Fun",
  [ExtensionTag.Markdown]: "Markdown",
  [ExtensionTag.Voice]: "Voice",
  [ExtensionTag.Privacy]: "Privacy",
  [ExtensionTag.Profiles]: "Profiles",
  [ExtensionTag.QualityOfLife]: "Quality of Life",
  [ExtensionTag.Library]: "Library"
};

export type Dependency = {
  id: string;
  type: DependencyType;
};

export enum DependencyType {
  Dependency = "dependency",
  Optional = "optional",
  Incompatible = "incompatible"
}

export function tryGetExtensionName(
  extensions: ExtensionManifest[],
  id: string
) {
  return extensions.find((ext) => ext.id === id)?.meta?.name ?? id;
}
