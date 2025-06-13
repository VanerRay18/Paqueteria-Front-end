import { Component } from '@angular/core';

@Component({
  selector: 'app-package-tracking',
  templateUrl: './package-tracking.component.html',
  styleUrls: ['./package-tracking.component.css']
})
export class PackageTrackingComponent {
  paquetes = [
    { codigo: 'JMX00238139845087145' },
    { codigo: 'JMX00238139845087145' },
    { codigo: 'JMX00238139845087145' },
    { codigo: 'JMX00238139845087145' },
    { codigo: 'JMX00238139845087145' },
    { codigo: 'JMX00238139845087145' }
  ];
}
