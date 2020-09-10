export interface IConfigurationService {
    getValue(key: string): Promise<string>;
    setValue(key: string, value: string): Promise<boolean>;
}
