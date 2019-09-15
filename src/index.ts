import { Automaton } from './Automaton'
import { log } from './util/log'
import * as NFAConfig from './sample/nfa2.json'

const nfa = new Automaton({...NFAConfig})

const dfa = nfa.convertToDfa()

const testString = 'aabaa'
const nfaSimulation = nfa.simulate(testString)
const dfaSimulation = dfa.simulate(testString)

log(nfaSimulation)
log(dfaSimulation)
log(nfaSimulation.accepted === dfaSimulation.accepted)