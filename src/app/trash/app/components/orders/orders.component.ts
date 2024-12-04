import { Component, inject, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { OrdersService } from '../../core/services/orders.service';
import {Order, OrderStatus} from '../../core/interfaces/orders.interface';
import { Button } from 'primeng/button';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CardModule, Button, ChartModule],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  private orderService = inject(OrdersService);

  orders: Order[] = [];
  loading = false;
  error: string | null = null;

  // Chart data
  chartData: any;
  chartOptions: any;

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.orderService.getOrders()
      .subscribe({
        next: (response) => {
          this.orders = response.data;
          /**
           * Genera los datos para el gráfico
           */
          this.generateChartData();
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Error fetching orders.' + err;
          console.error(err);
          this.loading = false;
        }
      });
  }

  /**
   * Genera los datos para el gráfico
   */
  private generateChartData(): void {
    const statuses = Object.values(OrderStatus);

    /**
     * Contar las órdenes por estado
     */
    const statusCounts = statuses.map(
      (status) => this.orders.filter((order) => order.status === status).length
    );

    /**
     * Configurar los datos del gráfico
     */
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');

    this.chartData = {
      labels: statuses,
      datasets: [
        {
          data: statusCounts,
          backgroundColor: [
            documentStyle.getPropertyValue('--yellow-500'),
            documentStyle.getPropertyValue('--green-500'),
            documentStyle.getPropertyValue('--red-500'),
            documentStyle.getPropertyValue('--blue-500'),
          ],
          hoverBackgroundColor: [
            documentStyle.getPropertyValue('--yellow-400'),
            documentStyle.getPropertyValue('--green-400'),
            documentStyle.getPropertyValue('--red-400'),
            documentStyle.getPropertyValue('--blue-400'),
          ],
        },
      ],
    };

    this.chartOptions = {
      cutout: '60%',
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },
      },
    };
  }
}
