let notes = [
  { id: 1, text: "Buy milk and bread", category: "personal" },
  { id: 2, text: "Finish the Day 3 assignment", category: "study" },
  { id: 3, text: "Email the project report to Grace", category: "work" },
  { id: 4, text: "Revise JavaScript arrays", category: "study" },
  { id: 5, text: "Call mum", category: "personal" },
];

function searchNotes(word) {
  const lowerWord = word.toLowerCase();
  return notes.filter(note => note.text.toLowerCase().includes(lowerWord));
}

function longestNote() {
  if (notes.length === 0) return null;
  let longest = notes[0];
  for (let note of notes) {
    if (note.text.length > longest.text.length) {
      longest = note;
    }
  }
  return longest;
}

function countByCategory() {
  const counts = {};
  for (let note of notes) {
    if (counts[note.category]) {
      counts[note.category]++;
    } else {
      counts[note.category] = 1;
    }
  }
  return counts;
}

function getSummary() {
  const counts = countByCategory();
  const total = notes.length;
  const word = total === 1 ? "note" : "notes";
  const parts = [];
  for (let cat in counts) {
    parts.push(`${counts[cat]} ${cat}`);
  }
  if (total === 0) return `0 notes:`;
  return `${total} ${word}: ${parts.join(", ")}.`;
}

function isDuplicate(text) {
  const cleaned = text.trim().toLowerCase();
  return notes.some(note => note.text.trim().toLowerCase() === cleaned);
}

function addNote(text, category) {
  const validCategories = ["personal", "work", "study"];
  if (text.length < 1 || text.length > 200) {
    console.log(`Failed: Text must be 1-200 characters, got ${text.length}`);
    return false;
  }
  if (isDuplicate(text)) {
    console.log(`Failed: Duplicate note - "${text}" already exists`);
    return false;
  }
  if (!validCategories.includes(category)) {
    console.log(`Failed: Invalid category "${category}" - must be personal, work or study`);
    return false;
  }
  const newId = notes.length > 0 ? Math.max(...notes.map(n => n.id)) + 1 : 1;
  notes.push({ id: newId, text: text.trim(), category: category });
  console.log(`Added: "${text}" as ${category}`);
  return true;
}

console.log("--- searchNotes tests ---");
console.log(searchNotes("Day")); // Expected: [{id:2, text:"Finish the Day 3 assignment"...}]
console.log(searchNotes("xyz")); // Expected: [] (edge case - no results)
console.log(searchNotes("EMAIL")); // Expected: [{id:3...}] case-insensitive

console.log("--- longestNote tests ---");
console.log(longestNote()); // Expected: {id:3, text:"Email the project report to Grace"...}
let savedNotes = [...notes];
notes = [];
console.log(longestNote()); // Expected: null (edge case - empty)
notes = savedNotes;

console.log("--- countByCategory tests ---");
console.log(countByCategory()); // Expected: {personal:2, study:2, work:1}
console.log(Object.keys(countByCategory()).length); // Expected: 3

console.log("--- getSummary tests ---");
console.log(getSummary()); // Expected: "5 notes: 2 personal, 2 study, 1 work."
notes = [{ id: 1, text: "Test", category: "personal" }];
console.log(getSummary()); // Expected: "1 note: 1 personal." (singular edge case)
notes = savedNotes;

console.log("--- isDuplicate tests ---");
console.log(isDuplicate("Buy milk and bread")); // Expected: true
console.log(isDuplicate(" BUY MILK AND BREAD ")); // Expected: true (trim + case)
console.log(isDuplicate("New note")); // Expected: false

console.log("--- addNote tests ---");
console.log(addNote("Read a book", "personal")); // Expected: true
console.log(addNote("Buy milk and bread", "personal")); // Expected: false - duplicate
console.log(addNote("", "personal")); // Expected: false - too short
console.log(addNote("Go jogging", "fitness")); // Expected: false - invalid category
console.log(addNote("a".repeat(201), "work")); // Expected: false - too long
console.log(getSummary()); // Expected: "6 notes: ..."
