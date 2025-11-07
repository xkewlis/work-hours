import { UserSequelize, WorkDaySequelize, WorkMarkSequelize } from "@/infrastructure/database/models";
import "@/infrastructure/database/index";

export const DbSequelize = async (): Promise<void> => {
    try {
        await UserSequelize.sync()
        await WorkDaySequelize.sync()
        await WorkMarkSequelize.sync()
        console.log('Database synchronized successfully.');
    } catch (error) {
        console.log(error)
        throw error;
    }
}
