#!/usr/bin/env bash
set -euo pipefail

# Smoke test for EduSarathi modules
BACKEND_URL=${BACKEND_URL:-http://localhost:5001}

echo "Running EduSarathi smoke tests against ${BACKEND_URL}"

pass=0
fail=0

test_post() {
  local name="$1" path="$2" json="$3"
  echo "- ${name}"
  if curl -sS -m 20 -H 'Content-Type: application/json' -d "$json" "${BACKEND_URL}${path}" | jq -e '.success == true' >/dev/null; then
    echo "  ✅ PASS: ${name}"
    pass=$((pass+1))
  else
    echo "  ❌ FAIL: ${name}"
    fail=$((fail+1))
  fi
}

# Quiz
test_post "Quiz Generation" "/api/quiz/generate" '{"subject":"Physics","topic":"Motion in a Straight Line","grade":11,"questionCount":5,"questionTypes":["mcq"],"difficulty":"medium","language":"en"}'

# Curriculum
test_post "Curriculum Generation" "/api/curriculum/generate" '{"subject":"Physics","grade":11,"duration":"1 semester","focus_areas":["Kinematics","Dynamics"]}'

# Slides
test_post "Slide Generation" "/api/slides/generate" '{"subject":"Physics","topic":"Vectors","grade":"11","slideCount":5,"theme":"default","template":"education","difficulty":"intermediate","language":"en","includeImages":false}'

# Mindmap
test_post "Mindmap Generation" "/api/mindmap/generate" '{"subject":"Physics","topic":"Gravitation","grade":11,"mindmapType":"conceptual","language":"en"}'

# Lecture Plan
test_post "Lecture Plan" "/api/lecture-plan/generate" '{"subject":"Physics","topic":"Work and Energy","grade":"11","duration":45,"learningObjectives":["Define work","Explain energy"],"difficulty":"intermediate","teachingStrategies":["Think-Pair-Share"],"language":"en"}'

# Grading
test_post "Grading" "/api/grading/evaluate" '{"question":"Define displacement.","student_answer":"Displacement is the change in position of an object in a specific direction.","correct_answer":"Displacement is the shortest vector distance between initial and final positions.","subject":"Physics","grade":11,"max_points":5}'

# Translation
test_post "Translation" "/api/translate" '{"text":"Welcome","sourceLanguage":"en","targetLanguage":"hi","domain":"general"}'

echo "\nSummary: ${pass} passed, ${fail} failed"
exit $([ $fail -eq 0 ] && echo 0 || echo 1)
