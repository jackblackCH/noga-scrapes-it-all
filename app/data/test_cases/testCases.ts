export const TEST_CASES = [
  {
    name: "HTML Job Listing",
    url: "https://tech-company.com/careers",
    sourceCode: `
        <div class="job-listing">
          <h2>Senior Software Engineer</h2>
          <p class="location">Location: Remote (US)</p>
          <div class="requirements">
            <h3>Requirements:</h3>
            <ul>
              <li>5+ years experience in full-stack development</li>
              <li>Expert in React, Node.js, TypeScript</li>
              <li>Experience with cloud platforms (AWS/GCP)</li>
            </ul>
          </div>
          <p class="salary">Salary: $130,000 - $180,000</p>
          <div class="type">Full-time</div>
        </div>
      `,
  },
  {
    name: "Plain Text Job Post",
    url: "https://startup.com/jobs",
    sourceCode: `
        We're hiring!
        
        Position: Machine Learning Engineer
        Experience Level: 3+ years in ML/AI
        Required Skills:
        * Python, PyTorch, TensorFlow
        * Deep Learning
        * Computer Vision
        * MLOps experience
        
        Location: San Francisco or Remote
        Compensation: $150k-200k DOE
        Type: Full-time
      `,
  },
  {
    name: "Multiple Jobs in HTML",
    url: "https://enterprise.com/careers",
    sourceCode: `
        <section class="careers">
          <article class="job">
            <h1>Product Manager</h1>
            <div>NYC or Remote</div>
            <p>$140k-170k</p>
            <ul>
              <li>5+ years PM experience</li>
              <li>Tech background</li>
            </ul>
          </article>
          <article class="job">
            <h1>UX Designer</h1>
            <div>Remote</div>
            <p>$110k-140k</p>
            <ul>
              <li>3+ years UX experience</li>
              <li>Figma expert</li>
            </ul>
          </article>
        </section>
      `,
  },
  {
    name: "Markdown Format",
    url: "https://company.com/jobs",
    sourceCode: `
        # Senior DevOps Engineer
        
        ## About the Role
        We're looking for a Senior DevOps Engineer to join our infrastructure team.
        
        ## Requirements
        - 5+ years DevOps experience
        - Kubernetes, Docker, AWS
        - CI/CD pipeline expertise
        - Infrastructure as Code
        
        **Location:** Remote (European time zones)
        **Salary:** €80,000 - €120,000
        **Type:** Full-time
      `,
  },
  {
    name: "JSON-like Structure",
    url: "https://api-company.com/positions",
    sourceCode: `
        {
          "position": "Backend Developer",
          "department": "Engineering",
          "location": "London, UK",
          "requirements": [
            "3+ years Java development",
            "Spring Boot expertise",
            "Microservices architecture"
          ],
          "salary_range": "£65,000 - £85,000",
          "employment_type": "Full-time"
        }
      `,
  },
  {
    name: "Informal Job Post",
    url: "https://startup.io/hiring",
    sourceCode: `
        🚀 Join our awesome startup! 🚀
        
        Looking for a rockstar Frontend Developer who loves creating beautiful UIs!
        
        What you'll need:
        💻 React/Vue expertise
        🎨 CSS wizardry
        ⚡ Performance optimization skills
        
        💰 Competitive salary ($90k-120k)
        🌍 Remote-first
        
        DM for details!
      `,
  },
  {
    name: "Complex Nested HTML",
    url: "https://corporate.com/opportunities",
    sourceCode: `
        <div class="job-wrapper">
          <div class="job-header">
            <div class="title-section">
              <h1 class="role">Data Scientist</h1>
              <span class="badge">New</span>
            </div>
            <div class="meta">
              <span class="location">Chicago</span>
              <span class="type">Full-time</span>
            </div>
          </div>
          <div class="job-details">
            <div class="requirements">
              <h3>Required Skills:</h3>
              <ul>
                <li>Python, R</li>
                <li>SQL expertise</li>
                <li>Statistics background</li>
              </ul>
            </div>
            <div class="compensation">
              <p>Base: $130k-160k</p>
              <p>Equity: 0.1-0.5%</p>
            </div>
          </div>
        </div>
      `,
  },
  {
    name: "Mixed Format Jobs",
    url: "https://tech-hub.com/jobs",
    sourceCode: `
        Current Openings:
  
        <div class="job">
          <h2>iOS Developer</h2>
          <p>$120k-150k • Remote</p>
        </div>
  
        ---
        
        Position: Android Developer
        Salary: $120k-150k
        Location: Remote
        
        ---
        
        {
          role: "QA Engineer",
          salary: "$90k-110k",
          location: "Hybrid - NYC"
        }
      `,
  },
  {
    name: "Table Format",
    url: "https://company.net/careers",
    sourceCode: `
        <table class="jobs">
          <tr>
            <th>Position</th>
            <th>Location</th>
            <th>Experience</th>
            <th>Salary</th>
          </tr>
          <tr>
            <td>Cloud Architect</td>
            <td>Remote</td>
            <td>7+ years</td>
            <td>$160k-200k</td>
          </tr>
          <tr>
            <td>SRE</td>
            <td>New York</td>
            <td>5+ years</td>
            <td>$140k-180k</td>
          </tr>
        </table>
      `,
  },
  {
    name: "Non-Standard Format",
    url: "https://creative-agency.com/join",
    sourceCode: `
        >>> Creative Director Wanted <<<
        
        =============================
        | Where: Los Angeles
        | When: Immediate Start
        | Pay: $160-200k DOE
        =============================
        
        You'll Need:
        >> 8+ years in creative direction
        >> Strong portfolio
        >> Team leadership experience
        
        -------------------
        Type: Full-time
        Department: Creative
        -------------------
      `,
  },
];
