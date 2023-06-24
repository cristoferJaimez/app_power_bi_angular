import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Inject, Renderer2 } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PowerBiService } from '../../services/powerbi.service';
import { MatDialogRef } from '@angular/material/dialog';
import { AnimationItem } from 'lottie-web';
import * as lottie from 'lottie-web';

@Component({
  selector: 'app-report-modal',
  templateUrl: './report-modal.component.html',
  styleUrls: ['./report-modal.component.css']
})
export class ReportModalComponent implements OnInit, OnDestroy {
  @ViewChild('reportContainer') reportContainer!: ElementRef;
  embedConfig: any;
  @ViewChild('animationContainer') animationContainer!: ElementRef;
  animationItem!: AnimationItem;

  constructor(
    private powerBiService: PowerBiService,
    private snackBar: MatSnackBar,
    private renderer: Renderer2,
    public dialogRef: MatDialogRef<ReportModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { reportId: number }
  ) { }

  ngOnInit() {
    const reportId = this.data.reportId.toString();
    this.powerBiService.getEmbedConfig(reportId).subscribe(
      (embedConfig: any) => {
        this.embedConfig = embedConfig;
        //console.log(this.embedConfig);
        this.loadReport();
      },
      (error: any) => {
        console.error('Error al obtener la configuración de incrustación del informe', error);
        this.snackBar.open('Error al obtener la configuración de incrustación del informe', 'Cerrar', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      }
    );
  }

  ngOnDestroy() {
    // Realiza las tareas de limpieza necesarias antes de destruir el componente
    // Por ejemplo, puedes desvincular los eventos y liberar recursos
  }

  loadReport() {
    const element = this.reportContainer.nativeElement;
    //this.renderer.setStyle(element, 'width', '100vw');
    //this.renderer.setStyle(element, 'height', '100vh');
    this.powerBiService.loadReport(this.embedConfig, element);
  }
  closeModal() {
    this.dialogRef.close();
  }

  ngAfterViewInit() {
    const animationPath = './assets/images/97443-loading-gray.json'; // Verifica la ruta del archivo JSON de la animación

    // Opciones de configuración de la animación (ajusta según tus necesidades)
    const animationOptions: lottie.AnimationConfigWithPath = {
      container: this.animationContainer.nativeElement,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: animationPath
    };

    // Cargar la animación utilizando lottie.default.loadAnimation()
    this.animationItem = lottie.default.loadAnimation(animationOptions);
  }
}
