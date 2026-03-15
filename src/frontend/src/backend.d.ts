import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ContactForm {
    name: string;
    email: string;
    message: string;
}
export interface JobListing {
    id: bigint;
    compensation: string;
    descriptionUrl: string;
    jobTitle: string;
    contactEmail: string;
    location: string;
}
export interface Profile {
    name: string;
    email: string;
    phone: string;
}
export interface ContentSection {
    id: string;
    content: string;
    labelText: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getAdminJobListingWithDescription(jobId: bigint, _adminUser: Principal): Promise<[JobListing, ContentSection]>;
    getCallerUserRole(): Promise<UserRole>;
    getJob(jobId: bigint): Promise<JobListing>;
    getJobListingWithDescription(jobId: bigint): Promise<[JobListing, ContentSection]>;
    getJobListings(): Promise<Array<JobListing>>;
    getJobListingsWithDescription(): Promise<Array<[JobListing, ContentSection]>>;
    getJobs(): Promise<Array<JobListing>>;
    getListingWithDividedDescription(jobId: bigint): Promise<[JobListing, Array<string>, Array<string>]>;
    getProfile(user: Principal): Promise<Profile>;
    isAdmin(callerToCheck: Principal): Promise<boolean>;
    isCallerAdmin(): Promise<boolean>;
    saveContactForm(contactForm: ContactForm): Promise<void>;
    saveProfile(profile: Profile): Promise<void>;
    subscribeToNewsletter(name: string, email: string): Promise<void>;
}
