import {Client} from 'app/api';

import {RuleType, PiiConfig, Rule} from './types';

type Applications = Record<string, Array<string>>;

function getCustomRule(rule: Required<Rule>): PiiConfig {
  if (rule.type === RuleType.PATTERN) {
    return {
      type: rule.type,
      pattern: rule.pattern,
      redaction: {
        method: rule.method,
      },
    };
  }
  return {
    type: rule.type,
    redaction: {
      method: rule.method,
    },
  };
}

function submitRules(api: Client, endpoint: string, rules: Array<Required<Rule>>) {
  const applications: Applications = {};
  const customRules: Record<string, PiiConfig> = {};

  for (let i = 0; i < rules.length; i++) {
    const rule = rules[i];
    const ruleName = `customRule${i}`;
    customRules[ruleName] = getCustomRule(rule);

    if (!applications[rule.source]) {
      applications[rule.source] = [];
    }

    if (!applications[rule.source].includes(ruleName)) {
      applications[rule.source].push(ruleName);
    }
  }

  const piiConfig = {
    rules: customRules,
    applications,
  };

  console.log('customRules', customRules);

  return api.requestPromise(endpoint, {
    method: 'PUT',
    data: {relayPiiConfig: JSON.stringify(piiConfig)},
  });
}

export default submitRules;
