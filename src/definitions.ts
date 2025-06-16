export interface YueFlashlightPlugin {
  echo(options: { value: string }): Promise<{ value: string }>;
}
