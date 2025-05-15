import {EmailGenerator} from "../dataGen/dataGen";

export const baseurl = process.env.BASE_URL!

export const invalidEmails = EmailGenerator.generateInvalidEmail();