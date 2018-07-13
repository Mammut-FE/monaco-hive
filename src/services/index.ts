export interface LanguageSettings {

}

import { HiveService } from './service';

let languageServices = null;

export function getLanguageService() {
    if (!languageServices) {
        languageServices = new HiveService();
    }
    
    return languageServices;
}
