import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ReportModalService {
  private embedConfig: any;

  setEmbedConfig(reportId: number, embedUrl: string, accessToken: string): void {
    this.embedConfig = {
      type: 'dashboard',
      id: reportId,
      embedUrl: embedUrl,
      accessToken: accessToken
    };
  }

  getEmbedConfig(): any {
    return this.embedConfig;
  }
}
