document.getElementById('colorToggleBtn').addEventListener('click', function () {
    // Get the current color value
    const currentColor = getComputedStyle(document.documentElement).getPropertyValue('--main-color').trim();

    // Toggle between pink and blue, including the box-shadow color
    if (currentColor === '#ff0077') {
        document.documentElement.style.setProperty('--main-color', '#007bff'); // Change to blue
        document.documentElement.style.setProperty('--box-shadow-color', 'rgba(0, 123, 255, 0.9)'); // Change box-shadow to blue
        this.textContent = 'Pink'; // Optionally change the button text
    } else {
        document.documentElement.style.setProperty('--main-color', '#ff0077'); // Change back to pink
        document.documentElement.style.setProperty('--box-shadow-color', 'rgba(255, 0, 119, 0.9)'); // Change box-shadow to pink
        this.textContent = 'Blue'; // Optionally change the button text
    }
});


//When the button is clicked, we look for a keyword. 
//If there is a keyword we generate idea
//otherwise we alert no keyword
document.getElementById('generateBtn').addEventListener('click', function () {
    const keyword = document.getElementById('keywordInput').value.trim();
    if (keyword) {
        generateIdea(keyword);
    } else {
        alert("Please enter a keyword or topic");
    }
});

//generate random idea function, ideas generated by Chat.gpt
function generateIdea(keyword) {
    const ideas = [
        `How to effectively use ${keyword} in your daily routine`,
        `Top 10 tips for mastering ${keyword}`,
        `The history of ${keyword} and its impact on modern society`,
        `Why ${keyword} is important for your business`,
        `The future of ${keyword} in the next decade`,
        `How ${keyword} has shaped who you are today`,
        `The most valuable lesson you've learned from ${keyword}`,
        `How can ${keyword} help you grow as a person?`,
        `Write about a time when ${keyword} brought you unexpected joy`,
        `What does ${keyword} mean to you on a personal level?`,
        `How can ${keyword} help improve your mental well-being?`,
        `The role of ${keyword} in your journey toward self-discovery`,
        `How ${keyword} could positively impact the world`,
        `Write about your first experience with ${keyword} and how it influenced you`,
        `How can you use ${keyword} to inspire others around you?`,
        `Imagine a world where everyone embraced ${keyword}—what would it look like?`,
        `Write a letter of gratitude for how ${keyword} has enriched your life`,
        `How can embracing ${keyword} help you achieve your long-term goals?`,
        `Reflect on how ${keyword} has helped you overcome challenges in your life`,
        `What positive habits can you develop around ${keyword}?`,
        `How can you use ${keyword} to create meaningful connections with others?`,
        `How does ${keyword} align with your core values?`,
        `What are the hidden benefits of ${keyword} that you've discovered?`,
        `Write about a person who embodies the essence of ${keyword} and why you admire them`
    ];


    const randomIdea = ideas[Math.floor(Math.random() * ideas.length)];
    displayIdea(randomIdea);
}

//display idea with buttons for copy, edit and delete
function displayIdea(idea) {
    const ideasContainer = document.getElementById('ideasContainer');

    const ideaItem = document.createElement('div');
    ideaItem.className = 'idea-item';

    ideaItem.innerHTML = `
        <span>${idea}</span>
        <button class="copyBtn">Copy</button>
        <button class="editBtn">Edit</button>
        <button class="deleteBtn">Delete</button>
    `;

    ideasContainer.appendChild(ideaItem);

    // Add event listeners for the buttons
    ideaItem.querySelector('.copyBtn').addEventListener('click', copyIdea);
    ideaItem.querySelector('.editBtn').addEventListener('click', editIdea);
    ideaItem.querySelector('.deleteBtn').addEventListener('click', deleteIdea);
}

//add function to copy the idea to clipboard
function copyIdea(event) {
    const idea = event.target.parentElement.querySelector('span').textContent;
    navigator.clipboard.writeText(idea).then(() => {
        //focus on the journal after copying the idea
        document.getElementById("journalInput").focus();
    }).catch(err => {
        console.error("Failed to copy: ", err);
    });
}

//add function to edit the idea
function editIdea(event) {
    const ideaElement = event.target.parentElement.querySelector('span');
    const newIdea = prompt("Edit your idea:", ideaElement.textContent);
    if (newIdea) {
        ideaElement.textContent = newIdea;
    }
}

//add function to delete the idea
function deleteIdea(event) {
    const ideaItem = event.target.parentElement;
    ideaItem.remove();
}

//Collect the start time when user starts to type
let startTime = null;

document.getElementById('journalInput').addEventListener('input', function () {
    if (!startTime) {
        startTime = new Date().toLocaleString();
    }
});

//save the journal entry with the timestamp
document.getElementById('saveJournalBtn').addEventListener('click', function () {
    const journalEntry = document.getElementById('journalInput').value.trim();

    const startTime = new Date().toLocaleString(); //Capture the current date and time 

    if (journalEntry) {
        const savedEntry = {
            text: journalEntry,
            time: startTime
        };

        //save to localStorage
        let entries = JSON.parse(localStorage.getItem('journalEntries')) || [];
        entries.push(savedEntry);
        localStorage.setItem('journalEntries', JSON.stringify(entries));

        //reset the form
        document.getElementById('journalInput').value = '';

        //update the list of saved entries
        displaySavedEntries();

    } else {
        alert("Please write in journal before saving.");
    }
});

//Display the journal Entries
function displaySavedEntries() {
    const entriesContainer = document.getElementById('entriesContainer');
    entriesContainer.innerHTML = ''; //clear existing entries

    const entries = JSON.parse(localStorage.getItem('journalEntries')) || [];

    entries.forEach((entry, index) => {
        const entryItem = document.createElement('div');
        entryItem.className = 'entry-item';

        entryItem.innerHTML = `
        <div>
        <strong>${entry.time}</strong><p>${entry.text}</p></div>
        <button class="editEntryBtn">Edit</button>
        <button class="deleteEntryBtn">Delete</button>
        `;

        //Add event listeners to the buttons
        entryItem.querySelector('.editEntryBtn').addEventListener('click', () => editEntry(index));
        entryItem.querySelector('.deleteEntryBtn').addEventListener('click', () => deleteEntry(index));
        entriesContainer.appendChild(entryItem);
    });
}

//Function to Edit the Journal Entries from  the index 
function editEntry(index) {
    const entries = JSON.parse(localStorage.getItem('journalEntries'));
    const newEntryText = prompt("Edit your Journal Entry:", entries[index].text);

    if (newEntryText) {
        entries[index].text = newEntryText;
        localStorage.setItem('journalEntries', JSON.stringify(entries));
        displaySavedEntries(); //update the display
    }
}

//Function to delete the Journal entries from the index
function deleteEntry(index) {
    let entries = JSON.parse(localStorage.getItem('journalEntries'));
    entries.splice(index, 1); //Removes the selected entry
    localStorage.setItem('journalEntries', JSON.stringify(entries));
    displaySavedEntries(); //Updates the display
}

//Load and display saved entries when the page loads
window.onload = displaySavedEntries;