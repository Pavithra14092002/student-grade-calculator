const calcy = async () => {
  // Get input values
  let name = document.getElementById('name').value;
  let tamil = parseFloat(document.getElementById('tamil').value);
  let english = parseFloat(document.getElementById('english').value);
  let maths = parseFloat(document.getElementById('maths').value);
  let comp = parseFloat(document.getElementById('comp').value);
  let phy = parseFloat(document.getElementById('phy').value);

  // Prepare data to send to backend
  const data = {
    name,
    tamil,
    english,
    maths,
    comp,
    phy
  };

  console.log('data to send:',data);

  // Send data to backend
  try {
    const response = await fetch('http://localhost:3000/submit-grades', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();
    console.log('response from server:',result);

    // Display results
    document.getElementById('showData').innerHTML = `
      ${result.message}<br>
      Out of 500 your total is ${result.data.totalGrades} and percentage is ${result.data.percentage}%.<br>
      Your overall grade is ${result.data.overallGrade}.<br>
      Overall Result: ${result.data.overallResult}.<br><br>
      <strong>Subject-wise Results:</strong><br>
      Tamil: ${tamil} (${result.data.subjectGrades.tamil}) - ${result.data.subjectResults.tamil}<br>
      English: ${english} (${result.data.subjectGrades.english}) - ${result.data.subjectResults.english}<br>
      Maths: ${maths} (${result.data.subjectGrades.maths}) - ${result.data.subjectResults.maths}<br>
      Computer: ${comp} (${result.data.subjectGrades.comp}) - ${result.data.subjectResults.comp}<br>
      Physics: ${phy} (${result.data.subjectGrades.phy}) - ${result.data.subjectResults.phy}
    `;
    document.getElementById('result').innerHTML = result.data.overallResult;
  } catch (error) {
    console.error('Error:', error);
  }
};
