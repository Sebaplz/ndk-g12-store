/**
 * AuthStore interface
 * Store utilizado para manejar la autenticación de un usuario
 */
export interface AuthStore {
  /**
   * token
   * Token de autenticación del usuario
   */
  token: string | null;

  /**
   * check
   * Vaalidar si los datos estan cargados
   */
  check: boolean;

  /**
   * loading
   * Indica si se está cargando la información
   */
  loading: boolean;
}
