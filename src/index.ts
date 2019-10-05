import { Automaton } from './Automaton'
import { log } from './util/log'
import * as NFAConfig from './sample/nfa4.json'

const nfa = new Automaton({ ...NFAConfig })

const dfa = nfa.convertToDfa()

const testString = 'abbabbabaaa'
const nfaSimulation = nfa.simulate(testString)
const dfaSimulation = dfa.simulate(testString)

log(nfaSimulation.acceptedPaths)
log(dfaSimulation.acceptedPaths)
log(nfaSimulation.accepted === dfaSimulation.accepted)

// log(dfa)
