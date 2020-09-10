export enum CareGoalStatus {
  Proposed = 'proposed',
  Planned = 'planned',
  Accepted = 'accepted',
  Active = 'active',
  OnHold = 'on hold',
  Completed = 'completed',
  Cancelled = 'cancelled',
  Rejected = 'rejected',
}

export enum CareGoalAchievementStatus {
  InProgress = 'in progress',
  Improving = 'improving',
  Worsening = 'worsening',
  NoChange = 'no change',
  Achieved = 'achieved',
  NotAchieved = 'not achieved',
  NoProgress = 'no progress',
  NotAttainable = 'not attainable',
}

export default interface CareGoal {
  id: string
  status: CareGoalStatus
  achievementStatus: CareGoalAchievementStatus
  priority: 'high' | 'medium' | 'low'
  description: string
  startDate: string
  dueDate: string
  createdOn: string
  note: string
}
