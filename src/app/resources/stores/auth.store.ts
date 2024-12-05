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

  /**
   * isAdmin
   * Indica si es admin o no, esta por ahora, ya que no se a implementado en el backend
   */
  isAdmin: boolean;

  /**
   * email
   * Email del usuario actual, para mostrarlo en la barra de navegación
   */
  email: string | null;
}
