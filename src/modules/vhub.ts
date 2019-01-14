import * as _ from "lodash";
import * as moment from "moment";
import { CSSProperties } from "react";

export enum Importance {
  LOW,
  MEDIUM,
  HIGH,
}

export function importanceString(i: Importance): string {
  switch (i) {
    case Importance.HIGH:
      return "High";
    case Importance.MEDIUM:
      return "Medium";
    case Importance.LOW:
      return "Low";
  }
}

export function importanceStyle(i: Importance): CSSProperties {
  switch (i) {
    case Importance.HIGH:
      return {
        backgroundColor: "#f3bbae",
      };
    case Importance.MEDIUM:
      return {
        backgroundColor: "#f6f6c2",
      };
    case Importance.LOW:
      return {
        backgroundColor: "#75c8cc",
      };
  }
}

export enum Progress {
  NOT_STARTED,
  IN_PROGRESS,
  DONE,
}

export function progressString(p: Progress): string {
  switch (p) {
    case Progress.NOT_STARTED:
      return "Not Started";
    case Progress.IN_PROGRESS:
      return "In Progress";
    case Progress.DONE:
      return "Done";
    default:
      return "Unknown";
  }
}

export enum Subcommittee {
  SKYPE_TUTORING,
  LEADERSHIP_CURRICULUM,
}

export function subcommitteeString(s: Subcommittee): string {
  switch (s) {
    case Subcommittee.SKYPE_TUTORING:
      return "Skype Tutoring";
    case Subcommittee.LEADERSHIP_CURRICULUM:
      return "Leadership Curriculum";
    default:
      return "Unknown";
  }
}

export enum Sort {
  PROGRESS,
  DEADLINE,
  IMPORTANCE,
}

// TODO add enum deadline
export enum Deadline {
  OVERDUE,
  THIS_WEEK,
  LATER,
}

// TODO make it so that we only use this for past events and things coming up soon
export function deadlineString(d: moment.Moment): string {
  return d.fromNow();
}

export function deadlineEnum(d: moment.Moment): Deadline {
  const today = moment();
  const oneWeek = moment(today).add(1, "week");
  if (d.isBefore(today)) {
    return Deadline.OVERDUE;
  } else if (d.isBefore(oneWeek)) {
    return Deadline.THIS_WEEK;
  } else {
    return Deadline.LATER;
  }
}

export interface IVolunteer extends Record<string, any> {
  name: string;
}

export function volunteerInitials(v: IVolunteer): string {
  return v.name
    .split(" ")
    .reduce(
      (acc: string, cur: string) => acc + cur.toUpperCase().charAt(0),
      ""
    );
}

export function self(): IVolunteer {
  return {
    name: "Sowmya Magham",
  };
}

const getDefaultTask = (): ITask => ({
  id: "",
  title: "",
  subcommittees: [],
  importance: Importance.MEDIUM,
  deadline: moment().add(1, "weeks"),
  volunteers: [],
  progress: Progress.NOT_STARTED,
  attachments: [],
});

export interface RequiredTask {
  title: string;
  subcommittees: Subcommittee[];
  volunteers: IVolunteer[];
}

// TODO add fields verification
export function createTask(fields: RequiredTask): ITask {
  return Object.assign(getDefaultTask(), fields);
}

// TODO require at least one subcommittees
// TODO have constructors
// TODO maybe use a constructor?
export interface ITask extends RequiredTask {
  id: string;
  importance: Importance;
  deadline: moment.Moment;
  description?: string;
  progress: Progress;
  attachments: string[]; // TODO?
}

export const SAMPLE_TASKS: ITask[] = _.map(
  _.map(
    [
      {
        title: "Find company",
        subcommittees: [Subcommittee.LEADERSHIP_CURRICULUM],
        deadline: moment().subtract(2, "d"),
      },
      {
        title: "Read about learn curriculum website",
        subcommittees: [
          Subcommittee.LEADERSHIP_CURRICULUM,
          Subcommittee.SKYPE_TUTORING,
        ],
        progress: Progress.IN_PROGRESS,
      },
      {
        title: "Discuss sponsorship",
        subcommittees: [Subcommittee.LEADERSHIP_CURRICULUM],
        importance: Importance.HIGH,
        volunteers: [self(), { name: "Pranita Mantravadi" }],
      },
      {
        title: "Finish skype tutor onboarding",
        subcommittees: [Subcommittee.SKYPE_TUTORING],
        importance: Importance.LOW,
      },
    ],
    x => (x.volunteers ? x : Object.assign(x, { volunteers: [self()] }))
  ),
  x => createTask(x)
);

export const DEFAULT_FILTERS = [
  Subcommittee.SKYPE_TUTORING,
  Subcommittee.LEADERSHIP_CURRICULUM,
];

export const DEFAULT_SORT = Sort.PROGRESS;
