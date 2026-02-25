export type HolidayType = "national" | "regional" | "company";

export interface CreateHolidayDto {
    holidayName: string;
    date:string; // ISO String from api
    description?:string;
    type:HolidayType;
}

export interface UpdateHolidayDto {
    holidayName?:string;
    date?:Date;
    description?:string;    
    type?:HolidayType;
    isActive?:boolean;
}

export interface HolidayResponseDto{
    id:string;
    holidayName:string;
    date:Date;
    description?:string;
    type:HolidayType;
    isActive:boolean;
    createdAt:Date;
    updatedAt:Date;
}