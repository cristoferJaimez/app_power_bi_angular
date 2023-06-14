import { Injectable } from '@angular/core';
import { Report, models, IEmbedConfiguration } from 'powerbi-client';
import { HttpClient } from '@angular/common/http';

declare const powerbi: any;

@Injectable({
  providedIn: 'root'
})
export class PowerBiService {
  private report!: Report;

  constructor(private http: HttpClient) { }

  getEmbedConfig(reportId: any) {
   
    const url = `http://localhost:3000/powerbi-report-details/${reportId}`;
    return this.http.get(url);
  }

  loadReport(embedConfig: IEmbedConfiguration, element: HTMLElement) {
    const config: models.IEmbedConfiguration = {
      type: 'report',
      id: embedConfig.id,
      embedUrl: embedConfig.embedUrl,
      accessToken: embedConfig.accessToken,
      permissions: models.Permissions.All,
      settings: {
        filterPaneEnabled: true,
        navContentPaneEnabled: true
      }
    };

    
    
    this.report = powerbi.embed(element, config);

    this.report.off("loaded");
    this.report.off("rendered");
    this.report.off("error");

    this.report.on("loaded", () => {
      console.log("Informe de Power BI cargado correctamente");
    });

    this.report.on("rendered", () => {
      console.log("Informe de Power BI renderizado correctamente");
    });

    this.report.on("error", (event: any) => {
      console.error("Error al cargar el informe de Power BI", event.detail);
    });

    this.report.off("buttonClicked");
    this.report.on("buttonClicked", (event: any) => {
      console.log("Botón de Power BI hace clic", event.detail);
    });
  }
}
