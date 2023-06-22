import { Injectable } from '@angular/core';
import { Report, models, IEmbedConfiguration } from 'powerbi-client';
import { HttpClient } from '@angular/common/http';
import * as pbi from 'powerbi-client';
declare const powerbi: any;

@Injectable({
  providedIn: 'root'
})
export class PowerBiService {
  private report!: Report;

  constructor(private http: HttpClient) { }

  getEmbedConfig(reportId: any) {
    const url = `http://localhost:3000/obtener-informes/${reportId}`;
    return this.http.get(url);
  }

  loadReport(embedConfig: any, element: HTMLElement) {
    const config: models.IEmbedConfiguration = {
      type: 'report',
      id: embedConfig.id,
      embedUrl: embedConfig.embedUrl,
      accessToken: embedConfig.accessToken,
      tokenType: pbi.models.TokenType.Embed,
      permissions: pbi.models.Permissions.All,
      viewMode: pbi.models.ViewMode.View,
      settings: {
        filterPaneEnabled: true,
        navContentPaneEnabled: true,
        authoringHintsEnabled: true
      }
    };

    //console.log(config);
    
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
