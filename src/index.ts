import { Automaton } from './Automaton'
// import { log } from './util/log'
import * as NFAConfig from './sample/nfa4.json'

// const testString = 'abbabbabaaa'

// const simulation = Automaton.simulateAll(NFAConfig, testString)

// log(simulation)

// log('Convert to RegExp')
// log(Automaton.convertToRegExp(NFAConfig))

// log('Convert to DFA')
// log(Automaton.convertToDfa(NFAConfig))

console.log(Automaton.getAutomatonType(NFAConfig))
