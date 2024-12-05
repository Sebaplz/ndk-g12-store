import {Product} from '../../modules/dashboard/core/utils/interfaces';

/**
 * ProductsStore interface
 * Store utilizado para manejar el estado de los productos
 */
export interface ProductsStore {
  /**
   * data
   * Productos cargados
   */
  data: Product[];

  /**
   * total
   * Total de productos
   */
  total: number;

  /**
   * page
   * Pagina actual
   */
  page: number;

  /**
   * limit
   * Limite de productos por pagina
   */
  limit: number;

  /**
   * loading
   * Indica si se está cargando los productos
   */
  loading: boolean;

  /**
   * error
   * Error de carga de productos
   */
  error: any;
}
