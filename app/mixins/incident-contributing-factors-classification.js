import Ember from 'ember';
export default Ember.Mixin.create({
  patientFactors: [

                      { type: 'Clinical condition',
                          components: [
                              { id: 'pf1',name: 'Pre-existing co-morbidity' },
                              { id: 'pf2',name: 'Complexity of condition' },
                              { id: 'pf3',name: 'Seriousness of condition' },
                              { id: 'pf4', name: 'Limited options available to treat condition' },
                              { id: 'pf5',name: 'Disability' }
                          ]
                      },

                      { type: 'Physical Factors',
                          components: [
                              { id: 'pf6',name: 'Poor general physical state' },
                              { id: 'pf7',name: 'Malnourished' },
                              { id: 'pf8',name: 'Dehydrated' },
                              { id: 'pf9',name: 'Age related issues' },
                              { id: 'pf10',name: 'Obese' },
                              { id: 'pf11',name: 'Poor sleep pattern' }
                          ]
                      },

                      { type: 'Social Factors ',
                          components: [
                              { id: 'pf12',name: 'Cultural / religious beliefs' },
                              { id: 'pf13',name: 'Language' },
                              { id: 'pf14',name: 'Lifestyle (smoking/ drinking/ drugs/diet)' },
                              { id: 'pf15',name: 'Sub-standard living accommodation (e.g. dilapidated)' },
                              { id: 'pf16',name: 'Life events' },
                              { id: 'pf17',name: 'Lack of support networks / (social protective factors -Mental Health Services)' },
                              { id: 'pf18',name: 'Engaging in high risk activity' }
                          ]
                      },

                      { type: 'Mental/Psychological Factors',
                          components: [
                              { id: 'pf19',name: 'Motivation issue' },
                              { id: 'pf20',name: 'Stress / Trauma' },
                              { id: 'pf21',name: 'Existing mental health disorder' },
                              { id: 'pf22',name: 'Lack of intent (Mental Health Services)' },
                              { id: 'pf23',name: 'Lack of mental capacity' },
                              { id: 'pf24',name: 'Learning Disability' }
                          ]
                      },

                      { type: 'Interpersonal relationships',
                          components: [
                              { id: 'pf25',name: 'Staff to patient and patient to staff' },
                              { id: 'pf26',name: 'Patient engagement with services' },
                              { id: 'pf27',name: 'Staff to family and family to staff' },
                              { id: 'pf28',name: 'Patient to patient' },
                              { id: 'pf29',name: 'Family to patient or patient to family' },
                              { id: 'pf30',name: 'Family to family (Siblings, parents, children)' }
                          ]
                      }
                  ],

  staffFactors:  [

                      { type: 'Physical issues',
                          components: [
                              { id: 'sf1',name: 'Poor general health (e.g. nutrition, hydration, diet, exercise, fitness)' },
                              { id: 'sf2',name: 'Disability (e.g. eyesight problems, dyslexia)' },
                              { id: 'sf3',name: 'Fatigue' },
                              { id: 'sf4', name: 'Infected Healthcare worker' }
                          ]
                      },

                      { type: 'Psychological Issues',
                          components: [
                              { id: 'sf5',name: 'Stress (e.g. distraction / preoccupation)' },
                              { id: 'sf6',name: 'Specific mental illness (e.g. depression)' },
                              { id: 'sf7',name: 'Mental impairment (e.g. illness, drugs, alcohol, pain)' },
                              { id: 'sf8',name: 'Lack of motivation (e.g. boredom, complacency, low job satisfaction)' }
                          ]
                      },

                      { type: 'Social Domestic',
                          components: [
                              { id: 'sf9',name: 'Domestic problems (e.g. family related issues)' },
                              { id: 'sf10',name: 'Lifestyle problems (e.g. financial/housing issues)' },
                              { id: 'sf11',name: 'Cultural beliefs' },
                              { id: 'sf12',name: 'Language' }
                          ]
                      },

                      { type: 'Personality Issues',
                          components: [
                              { id: 'sf13',name: 'Low self confidence / over confidence (e.g. Gregarious, reclusive, interactive)' },
                              { id: 'sf14',name: 'Risk averse / risk taker' },
                              { id: 'sf15',name: 'Bogus Healthcare worker' }
                          ]
                      },

                      { type: 'Cognitive factors',
                          components: [
                              { id: 'sf16',name: 'Preoccupation / narrowed focus (Situational awareness problems)' },
                              { id: 'sf17',name: 'Perception/viewpoint affected by info. or mindset (Expectation/Confirmation bias)' },
                              { id: 'sf18',name: 'Inadequate decision/action caused by Group influence' },
                              { id: 'sf19',name: 'Distraction / Attention deficit' },
                              { id: 'sf20',name: 'Overload' },
                              { id: 'sf21',name: 'Boredom' }
                          ]
                      }

                  ],

  taskFactors:    [
                      { type: 'Guidelines, Policies and Procedures',
                          components: [
                              { id: 'tf1',name: 'Not up-to-date' },
                              { id: 'tf2',name: 'Unavailable at appropriate location (e.g. Lost/missing/non-existent/not accessible when needed)' },
                              { id: 'tf3',name: 'Unclear/not useable (Ambiguous; complex; irrelevant, incorrect)' },
                              { id: 'tf4', name: 'Not adhered to / not followed' },
                              { id: 'tf5', name: 'Not monitored / reviewed' },
                              { id: 'tf6', name: 'Inappropriately targeted/focused (i.e. not aimed at right audience)' },
                              { id: 'tf7', name: 'Inadequate task disaster plans and drills' }
                          ]
                      },

                      { type: 'Decision making aids',
                          components: [
                              { id: 'tf8',name: 'Aids not available (e.g. CTG machine; checklist; risk assessment tool; fax machine to enable remote assessment of results)' },
                              { id: 'tf9',name: 'Aids not working (e.g. CTG machine, risk assessment tool, fax machine)' },
                              { id: 'tf10',name: 'Difficulties in accessing senior / specialist advice' },
                              { id: 'tf11',name: 'Lack of easy access to technical information, flow charts and diagrams' },
                              { id: 'tf12',name: 'Lack of prioritization of guidelines' },
                              { id: 'tf13',name: 'Incomplete information (test results, patient history)' }
                          ]
                      },

                      { type: 'Procedural or Task Design',
                          components: [
                              { id: 'tf14',name: 'Poorly designed (i.e. Too complex; too much info.; difficult to conceive or remember)' },
                              { id: 'tf15',name: 'Guidelines do not enable one to carry out the task in a timely manner' },
                              { id: 'tf16',name: 'Too many tasks to perform at the same time' },
                              { id: 'tf17',name: 'Contradicting tasks' },
                              { id: 'tf18',name: 'Staff do not agree with the task/procedure design' },
                              { id: 'tf19',name: 'Stages of the task not designed so that each step can realistically be carried out' },
                              { id: 'tf20',name: 'Lack of direct or understandable feedback from the task' },
                              { id: 'tf21',name: 'Misrepresentation of information' },
                              { id: 'tf22',name: 'Inappropriate transfer of processes from other situations' },
                              { id: 'tf23',name: 'Inadequate Audit, Quality control, Quality Assurance built into the task design' },
                              { id: 'tf24',name: 'Insufficient opportunity to influence task/outcome where necessary' },
                              { id: 'tf25',name: 'Appropriate automation not available' }
                          ]
                      }
                  ],

  communicationFactors: [
                          { type: 'Verbal communication',
                              components: [
                                  { id: 'cf1',name: 'Inappropriate tone of voice and style of delivery for situation' },
                                  { id: 'cf2',name: 'Ambiguous verbal commands / directions' },
                                  { id: 'cf3',name: 'Incorrect use of language' },
                                  { id: 'cf4', name: 'Made to inappropriate person(s)' },
                                  { id: 'cf5', name: 'Incorrect communication channels used' }
                              ]
                          },

                          { type: 'Written communication',
                              components: [
                                  { id: 'cf6',name: 'Inadequate patient identification' },
                                  { id: 'cf7',name: 'Records difficult to read' },
                                  { id: 'cf8',name: 'All relevant records not stored together and accessible when required' },
                                  { id: 'cf9',name: 'Records incomplete or not contemporaneous (e.g. unavailability of patient management plans, patient risk assessments, etc)' },
                                  { id: 'cf10',name: 'Written information not circulated to all team members' },
                                  { id: 'cf11',name: 'Communication not received' },
                                  { id: 'cf12',name: 'Communications directed to the wrong people' },
                                  { id: 'cf13',name: 'Lack of information to patients' },
                                  { id: 'cf14',name: 'Lack of effective communication to staff of risks (Alerts systems etc)' }
                              ]
                          },

                          { type: 'Non-verbal communication',
                              components: [
                                  { id: 'cf15',name: 'Body Language issues (closed, open, body movement, gestures, facial expression)' }
                              ]
                          },

                          { type: 'Communication Management',
                              components: [
                                  { id: 'cf16',name: 'Communication strategy and policy not defined / documented ' },
                                  { id: 'cf17',name: 'Ineffective involvement of patient/carer in treatment and decisions' },
                                  { id: 'cf18',name: 'Lack of effective communication to patients/relatives/carers of risks' },
                                  { id: 'cf19',name: 'Lack of effective communication to patients about incidents (being open)' },
                                  { id: 'cf20',name: 'Information from patient/carer disregarded' },
                                  { id: 'cf21',name: 'Ineffective communication flow to staff up, down and across' },
                                  { id: 'cf22',name: 'Ineffective interface for communicating with other agencies (partnership working)' },
                                  { id: 'cf23',name: 'Lack of measures for monitoring communication' }
                              ]
                          }
                      ],

  equipmentFactors:   [
                          { type: 'Displays',
                              components: [
                                  { id: 'ef1',name: 'Incorrect information / feedback available' },
                                  { id: 'ef2',name: 'Inconsistent or unclear information' },
                                  { id: 'ef3',name: 'Illegible information' },
                                  { id: 'ef4', name: 'Interference/unclear equipment display' }
                              ]
                          },

                          { type: 'Integrity',
                              components: [
                                  { id: 'ef5',name: 'Poor working order' },
                                  { id: 'ef6',name: 'Inappropriate size' },
                                  { id: 'ef7',name: 'Unreliable' },
                                  { id: 'ef8',name: 'Ineffective safety features / not designed to fail safe' },
                                  { id: 'ef9',name: 'Poor maintenance program' },
                                  { id: 'ef10',name: 'Failure of general services  (power supply, water, piped gases etc)' }
                              ]
                          },

                          { type: 'Positioning',
                              components: [
                                  { id: 'ef11',name: 'Correct equipment not available' },
                                  { id: 'ef12',name: 'Insufficient equipment / emergency backup equipment' },
                                  { id: 'ef13',name: 'Incorrectly placed for use' },
                                  { id: 'ef14',name: 'Incorrectly stored' }
                              ]
                          },

                          { type: 'Usability',
                              components: [
                                  { id: 'ef15',name: 'Unclear controls' },
                                  { id: 'ef16',name: 'Not intuitive in design' },
                                  { id: 'ef17',name: 'Confusing use of colour or symbols' },
                                  { id: 'ef18',name: 'Lack of or poor quality user manual' },
                                  { id: 'ef19',name: 'Not designed to make detection of problems obvious' },
                                  { id: 'ef20',name: 'Use of items which have similar names or packaging' },
                                  { id: 'ef21',name: 'Problems of compatibility' }
                              ]
                          }
                      ],

  workEnvFactors: [

                      { type: 'Administrative factors',
                          components: [
                              { id: 'wef1',name: 'Unreliable or ineffective general administrative systems (Please specify e.g.: Bookings, Patient identification, ordering, requests, referrals, appointments)' },
                              { id: 'wef2',name: 'Unreliable or ineffective admin infrastructure (e.g. Phones, bleep systems etc)' },
                              { id: 'wef3',name: 'Unreliable or ineffective administrative support' }
                          ]
                      },

                      { type: 'Design of physical environment',
                          components: [
                              { id: 'wef4',name: 'Poor or inappropriate office design (computer chairs, height of tables, anti-glare screens, security screens, panic buttons, placing of filing cabinets, storage facilities, etc.)' },
                              { id: 'wef5',name: 'Poor or inappropriate area design (length, shape, visibility, provision of space)' },
                              { id: 'wef6',name: 'Inadequate security provision' },
                              { id: 'wef7',name: 'Lack of secure outside space' },
                              { id: 'wef8',name: 'Inadequate lines of sight' },
                              { id: 'wef9',name: 'Inadequate/inappropriate use of colour contrast/patterns (walls/doors/flooring etc)' }
                          ]
                      },

                      { type: 'Environment',
                          components: [
                              { id: 'wef10',name: 'Facility not available (failure or lack of capacity)' },
                              { id: 'wef11',name: 'Fixture or fitting not available (failure or lack of capacity)' },
                              { id: 'wef12',name: 'Single sex accommodation limitation/breach' },
                              { id: 'wef13',name: 'Ligature/anchor points' },
                              { id: 'wef14',name: 'Housekeeping issues – lack of cleanliness' },
                              { id: 'wef15',name: 'Temperature too high/low' },
                              { id: 'wef16',name: 'Lighting too dim or bright, or lack of' },
                              { id: 'wef17',name: 'Noise levels too high or low' },
                              { id: 'wef18',name: 'Distractions' }
                          ]
                      },

                      { type: 'Staffing',
                          components: [
                              { id: 'wef19',name: 'Inappropriate skill mix (e.g. Lack of senior staff; Trained staff; Approp. trained staff) ' },
                              { id: 'wef20',name: 'Low staff to patient ratio' },
                              { id: 'wef21',name: 'No / inaccurate workload / dependency assessment' },
                              { id: 'wef22',name: 'Use of temporary staff' },
                              { id: 'wef23',name: 'High staff turnover' }
                          ]
                      },

                      { type: 'Work load and hours of work',
                          components: [
                              { id: 'wef24',name: 'Shift related fatigue' },
                              { id: 'wef25',name: 'Excessive working hours' },
                              { id: 'wef26',name: 'Lack of breaks during work hours' },
                              { id: 'wef27',name: 'Excessive of extraneous tasks' },
                              { id: 'wef28',name: 'Lack of social relaxation, rest and recuperation' }
                          ]
                      },

                      { type: 'Time',
                          components: [
                              { id: 'wef29',name: 'Delays caused by system failure or design' },
                              { id: 'wef30',name: 'Time pressure' }
                          ]
                      }

                  ],

  organisationalFactors:   [
                          { type: 'Organisational structure',
                              components: [
                                  { id: 'of1',name: 'Hierarchical structure/Governance structure not conducive to discussion, problem sharing, etc.' },
                                  { id: 'of2',name: 'Tight boundaries for accountability and responsibility' },
                                  { id: 'of3',name: 'Professional isolation' },
                                  { id: 'of4', name: 'Clinical versus the managerial model' },
                                  { id: 'of5',name: 'Inadequate maintenance' },
                                  { id: 'of6',name: 'Lack of robust Service level agreements/contractual arrangements' },
                                  { id: 'of7',name: 'Inadequate safety terms and conditions of contracts' }
                              ]
                          },

                          { type: 'Priorities',
                              components: [
                                  { id: 'of8',name: 'Not safety driven' },
                                  { id: 'of9',name: 'External assessment driven e.g. Annual Health checks' },
                                  { id: 'of10',name: 'Financial balance focused' }
                              ]
                          },

                          { type: 'Externally imported risks',
                              components: [
                                  { id: 'of11',name: 'Unexpected adverse impact of national policy/guidance (from Department of Health/Health authorities/Professional colleges)' },
                                  { id: 'of12',name: 'Locum / Agency policy and usage' },
                                  { id: 'of13',name: 'Contractors related problem' },
                                  { id: 'of14',name: 'Equipment loan related problem' },
                                  { id: 'of15',name: 'Lack of service provision' },
                                  { id: 'of16',name: 'Bed Occupancy levels (Unplanned bed opening/closures)' },
                                  { id: 'of17',name: 'PFI related problems (Private Finance Initiative)' }
                              ]
                          },

                          { type: 'Safety culture',
                              components: [
                                  { id: 'of18',name: 'Inappropriate safety / efficiency balance' },
                                  { id: 'of19',name: 'Poor rule compliance' },
                                  { id: 'of20',name: 'Lack of risk management plans' },
                                  { id: 'of21',name: 'Inadequate leadership example (e.g. visible evidence of commitment to safety)' },
                                  { id: 'of22',name: 'Inadequately open culture to allow appropriate communication' },
                                  { id: 'of23',name: 'Inadequate learning from past incidents' },
                                  { id: 'of24',name: 'Incentives for \'at risk/\'\'risk taking\' behaviors' },
                                  { id: 'of25',name: 'Acceptance/toleration of inadequate adherence to current practice' },
                                  { id: 'of26',name: 'Ignorance/poor awareness of inadequate adherence to current practice' },
                                  { id: 'of27',name: 'Disempowerment of staff to escalate issues or take action' }
                              ]
                          }
                      ],

  educationAndTrainingFactors: [
                          { type: 'Competence',
                              components: [
                                  { id: 'etf1',name: 'Lack of knowledge' },
                                  { id: 'etf2',name: 'Lack of skills' },
                                  { id: 'etf3',name: 'Inexperience' },
                                  { id: 'etf4', name: 'Inappropriate experience or lack of quality experience' },
                                  { id: 'etf5',name: 'Unfamiliar task' },
                                  { id: 'etf6',name: 'Lack of testing and assessment' }
                              ]
                          },

                          { type: 'Supervision',
                              components: [
                                  { id: 'etf7',name: 'Inadequate supervision' },
                                  { id: 'etf8',name: 'Lack of / inadequate mentorship' },
                                  { id: 'etf9',name: 'Training results not monitored/acted upon' }
                              ]
                          },

                          { type: 'Availability/accessibility',
                              components: [
                                  { id: 'etf10',name: 'Training needs analysis not conducted/acted upon' },
                                  { id: 'etf11',name: 'On the job training unavailable or inaccessible' },
                                  { id: 'etf12',name: 'Emergency Training unavailable or inaccessible' },
                                  { id: 'etf13',name: 'Team training unavailable or inaccessible' },
                                  { id: 'etf14',name: 'Core skills training unavailable or inaccessible' },
                                  { id: 'etf15',name: 'Refresher courses unavailable or inaccessible)' }
                              ]
                          },

                          { type: 'Appropriateness',
                              components: [
                                  { id: 'etf16',name: 'Inappropriate content' },
                                  { id: 'etf17',name: 'Inappropriate target audience' },
                                  { id: 'etf18',name: 'Inappropriate style of delivery' },
                                  { id: 'etf19',name: 'Time of day provided inappropriate' }
                              ]
                          }
                      ],

  teamFactors: [
                          { type: 'Role Congruence',
                              components: [
                                  { id: 'tmf1',name: 'Lack of shared understanding' },
                                  { id: 'tmf2',name: 'Role + responsibility definitions misunderstood/not clearly defined' }
                              ]
                          },

                          { type: 'Leadership ',
                              components: [
                                  { id: 'tmf3',name: 'Ineffective leadership – clinically ' },
                                  { id: 'tmf4',name: 'Ineffective leadership – managerially' },
                                  { id: 'tmf5',name: 'Lack of decision making' },
                                  { id: 'tmf6',name: 'Inappropriate decision making' },
                                  { id: 'tmf7',name: 'Untimely decision making (delayed)' },
                                  { id: 'tmf8',name: 'Leader poorly respected' }
                              ]
                          },

                          { type: 'Availability/accessibility',
                              components: [
                                  { id: 'tmf9',name: 'Training needs analysis not conducted/acted upon' },
                                  { id: 'tmf10',name: 'On the job training unavailable or inaccessible' },
                                  { id: 'tmf11',name: 'Emergency Training unavailable or inaccessible' },
                                  { id: 'tmf12',name: 'Team training unavailable or inaccessible' },
                                  { id: 'tmf13',name: 'Core skills training unavailable or inaccessible' },
                                  { id: 'tmf14',name: 'Refresher courses unavailable or inaccessible)' }
                              ]
                          },

                          { type: 'Support and cultural factors',
                              components: [
                                  { id: 'tmf15',name: 'Lack of support networks for staff' },
                                  { id: 'tmf16',name: 'Inappropriate level of assertiveness' },
                                  { id: 'tmf17',name: 'Negative team reaction(s) to adverse events' },
                                  { id: 'tmf18',name: 'Negative team reaction to conflict' },
                                  { id: 'tmf19',name: 'Negative team reaction to newcomers' },
                                  { id: 'tmf20',name: 'Routine violation of rules/regulations' },
                                  { id: 'tmf21',name: 'Lack of team openness/communication with colleagues' },
                                  { id: 'tmf22',name: 'Inadequate inter-professional challenge' },
                                  { id: 'tmf23',name: 'Failure to seek support' },
                                  { id: 'tmf24',name: 'Failure to address/manage issues of competence (whistle blowing)' }
                              ]
                          }
                      ]
});
