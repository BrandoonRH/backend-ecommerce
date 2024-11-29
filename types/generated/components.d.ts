import type { Schema, Struct } from '@strapi/strapi';

export interface SalesChartsVentas extends Struct.ComponentSchema {
  collectionName: 'components_sales_charts_ventas';
  info: {
    displayName: 'ChartsVentas';
    icon: 'chartPie';
  };
  attributes: {
    data: Schema.Attribute.JSON;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'sales.charts-ventas': SalesChartsVentas;
    }
  }
}
