# Domain Model

## User
id
email
password
role
status
createdAt

roles:
employee
manager
admin

## Employee
id
firstName
lastName
employeeId
jobTitleId
shiftId
status

## Shift
id
name
startTime
endTime
days

## TimeEntry
id
employeeId
date
clockIn
clockOut
chargeCode
notes

## Timesheet
id
employeeId
periodStart
periodEnd
status

status:
draft
submitted
approved
rejected

## TimeCorrection
id
timeEntryId
requestedBy
reason
oldValue
newValue
status

## OvertimeRecord
id
employeeId
date
hours
approved

## TimeOffRequest
id
employeeId
type
startDate
endDate
status

## Alert
id
type
message
userId
status