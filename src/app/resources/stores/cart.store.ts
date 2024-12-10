import {CartProduct} from '../../modules/dashboard/core/utils/interfaces';

export interface CartStore {
  /**
   * products
   * Productos del carrito
   */
  products: CartProduct[];

  /**
   * total
   * Total de productos del carrito
   */
  total: number;

  /**
   * loading
   * Indica si se está cargando los productos del carrito
   */
  loading: boolean;

  /**
   * check
   * Validar si los datos estan cargados
   */
  check: boolean

  /**
   * error
   * Error de carga de productos del carrito
   */
  error: any;

  /**
   * blockedProducts
   * Productos bloqueados en el carrito
   */
  blockedProducts: number[];
}
