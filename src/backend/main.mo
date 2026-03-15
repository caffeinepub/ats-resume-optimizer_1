import Nat "mo:core/Nat";
import List "mo:core/List";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import MixinStorage "blob-storage/Mixin";
import MixinAuthorization "authorization/MixinAuthorization";
import Storage "blob-storage/Storage";
import AccessControl "authorization/access-control";

actor {
  module ProfileModule {
    public type Profile = {
      name : Text;
      email : Text;
      phone : Text;
    };
  };
  type Profile = ProfileModule.Profile;

  module ContactForm {
    public type ContactForm = {
      name : Text;
      email : Text;
      message : Text;
    };
  };
  type ContactForm = ContactForm.ContactForm;

  module JobListing {
    public type JobListing = {
      id : Nat;
      jobTitle : Text;
      descriptionUrl : Text;
      contactEmail : Text;
      compensation : Text;
      location : Text;
    };
  };
  type JobListing = JobListing.JobListing;

  module ContentSection {
    public type ContentSection = {
      id : Text;
      labelText : Text;
      content : Text;
    };
  };
  type ContentSection = ContentSection.ContentSection;

  // In a real application, jobs would be persistent
  var jobs : List.List<JobListing> = List.empty<JobListing>();
  var newsletters = Map.empty<Text, Text>(); // email to name
  var blogEntries = Map.empty<Nat, Text>();
  var profiles = Map.empty<Principal, Profile>(); // user to profile

  let websiteSections = Map.empty<Text, ContentSection>();

  // Persistent storage for uploads
  let logoStorage = Map.empty<Text, Storage.ExternalBlob>();

  // Authorization system state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  public query ({ caller }) func isAdmin(callerToCheck : Principal) : async Bool {
    switch (AccessControl.getUserRole(accessControlState, callerToCheck)) {
      case (#admin) { true };
      case (_) { false };
    };
  };

  public query ({ caller }) func getJobs() : async [JobListing] {
    jobs.reverse().sliceToArray(0, Nat.min(5, jobs.size()));
  };

  public query ({ caller }) func getJob(jobId : Nat) : async JobListing {
    switch (jobs.sliceToArray(0, jobs.size()).find(func(entry) { entry.id == jobId })) {
      case (null) { Runtime.trap("Job not found") };
      case (?job) { job };
    };
  };

  public query ({ caller }) func getJobListings() : async [JobListing] {
    jobs.reverse().sliceToArray(0, Nat.min(5, jobs.size()));
  };

  public query ({ caller }) func getJobListingsWithDescription() : async [(JobListing, ContentSection)] {
    let jobList = jobs.reverse().sliceToArray(0, Nat.min(5, jobs.size()));
    let descriptions = jobList.map(
      func(entry) {
        switch (websiteSections.get(entry.descriptionUrl)) {
          case (?desc) { (entry, desc) };
          case (null) {
            let empty : ContentSection = {
              id = entry.descriptionUrl;
              labelText = "No Description";
              content = "";
            };
            (entry, empty);
          };
        };
      }
    );
    descriptions;
  };

  public query ({ caller }) func getJobListingWithDescription(jobId : Nat) : async (JobListing, ContentSection) {
    switch (jobs.sliceToArray(0, jobs.size()).find(func(entry) { entry.id == jobId })) {
      case (null) { Runtime.trap("Job not found") };
      case (?job) {
        switch (websiteSections.get(job.descriptionUrl)) {
          case (?desc) { (job, desc) };
          case (null) {
            let empty : ContentSection = {
              id = job.descriptionUrl;
              labelText = "No Description";
              content = "";
            };
            (job, empty);
          };
        };
      };
    };
  };

  public query ({ caller }) func getListingWithDividedDescription(jobId : Nat) : async (JobListing, [Text], [Text]) {
    switch (jobs.sliceToArray(0, jobs.size()).find(func(entry) { entry.id == jobId })) {
      case (null) { Runtime.trap("Job not found") };
      case (?job) {
        let responsibilitiesList = [
          "Collaborate with cross-functional teams.",
          "Develop clean, bug-free code.",
          "Ensure timely project delivery."
        ];
        let requirementsList = [
          "Bachelor's degree required.",
          "Minimum 5 years experience.",
          "Proficient in functional programming."
        ];
        (job, responsibilitiesList, requirementsList);
      };
    };
  };

  public query ({ caller }) func getAdminJobListingWithDescription(jobId : Nat, _adminUser : Principal) : async (JobListing, ContentSection) {
    switch (jobs.sliceToArray(0, jobs.size()).find(func(entry) { entry.id == jobId })) {
      case (null) { Runtime.trap("Job not found") };
      case (?job) {
        switch (websiteSections.get(job.descriptionUrl)) {
          case (?desc) { (job, desc) };
          case (null) {
            let empty : ContentSection = {
              id = job.descriptionUrl;
              labelText = "No Description";
              content = "";
            };
            (job, empty);
          };
        };
      };
    };
  };

  public query ({ caller }) func getProfile(user : Principal) : async Profile {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only an admin or the user himself can fetch this profile");
    };
    switch (profiles.get(user)) {
      case (null) { Runtime.trap("Profile not found") };
      case (?profile) { profile };
    };
  };

  public shared ({ caller }) func saveProfile(profile : Profile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save their own profile");
    };
    profiles.add(caller, profile);
  };

  public shared ({ caller }) func saveContactForm(contactForm : ContactForm) : async () {
    // Contact forms can be anonymous.
    Runtime.trap("Not yet implemented. Use canister http_outcall to directly send the form.");
  };

  public shared ({ caller }) func subscribeToNewsletter(name : Text, email : Text) : async () {
    // Newsletter can be anonymous.
    newsletters.add(email, name);
  };
};
