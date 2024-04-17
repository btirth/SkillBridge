import { createContext, useContext } from "react";
import { PaymentsStore } from "./PaymentsStore";
import { BookingStore } from "./BookingStore";
import { UserStore } from "./UserStore";
import { DashboardStore } from "./DashboardStore";

/**
 * Centralizes the application's state management by aggregating individual MobX stores.
 * This class acts as a root store that instantiates and provides access to various stores, such as PaymentsStore,
 * BookingStore, and UserStore. This approach enables easy access and management of the application's state in a unified manner.
 *
 * Used solution from https://dev.to/cakasuma/using-mobx-hooks-with-multiple-stores-in-react-3dk4 to efficiently combine multiple stores
 * and dynamically access using reacts useContext hook
 */
export class RootStore {
  paymentsStore: PaymentsStore;
  bookingStore: BookingStore;
  userStore: UserStore;
  dashboardStore: DashboardStore;

  constructor() {
    this.paymentsStore = new PaymentsStore(this);
    this.bookingStore = new BookingStore(this);
    this.userStore = new UserStore(this);
    this.dashboardStore = new DashboardStore(this);
  }
}

const StoresContext = createContext(new RootStore());
export const useStores = () => useContext(StoresContext);
