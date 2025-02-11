import dotenv from 'dotenv';
import { z } from "zod";

dotenv.config();

const ENVSchema = z.object({
    SUPABASE_URL: z.string().min(1),
    SUPABASE_ANON_KEY: z.string().min(1),
    SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
    MQTT_BROKER_URL: z.string().min(1),
    MQTT_ACCESS_USERNAME: z.string().min(1),
    MQTT_ACCESS_PASSWORD: z.string().min(1),
    MQTT_BROKER_PORT: z.string().min(1),
    MQTT_BROKER_PORT_WS: z.string().min(1),
    APP_PORT: z.string().min(1),
});

export const getEnv = () => {
    return ENVSchema.parse(process.env);
};
