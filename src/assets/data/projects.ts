export type ProjectType = {
  id: string
  name: string
  date: string
  endDate?: string
  description: string
}

export const projects: ProjectType[] = [
  {
    id: 'out-west-trip',
    name: 'Out West Trip',
    date: '04-27-2021',
    description: 'Three week van trip out west with Ben.',
  },
]
