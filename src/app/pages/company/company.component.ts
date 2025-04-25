import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SectionCardComponent } from "../../shared/shared-home/components-home/section-card/section-card.component";

interface Complaint {
  id: string;
  date: Date;
  category: string;
  status: string;
  severity: string;
  description: string;
  customerName: string;
  customerEmail: string;
  responses: Array<{
    date: Date;
    message: string;
  }>;
}

@Component({
  selector: 'app-company',
  standalone: true,
  imports: [CommonModule, FormsModule, SectionCardComponent, SectionCardComponent],
  templateUrl: './company.component.html',
  styleUrl: './company.component.css'
})
export class CompanyComponent {
  currentDate = new Date();

  companyData = {
    name: "Tech Solutions Inc.",
    email: "support@techsolutions.com",
    phone: "+1 (555) 123-4567"
  };

  statistics = {
    total: 150,
    resolved: 120,
    pending: 30
  };

  complaints: Complaint[] = [];
  filteredComplaints: Complaint[] = [];
  selectedComplaint: Complaint | null = null;

  filters = {
    search: "",
    status: "",
    severity: ""
  };

  ngOnInit() {
    this.loadMockData();
    this.applyFilters();
  }

  loadMockData() {
    this.complaints = [
      {
        id: "COMP-001",
        date: new Date(2024, 0, 15),
        category: "Technical",
        status: "open",
        severity: "high",
        description: "Server downtime affecting multiple clients",
        customerName: "John Doe",
        customerEmail: "john@example.com",
        responses: [
          {
            date: new Date(2024, 0, 15),
            message: "Issue acknowledged, investigating the root cause."
          }
        ]
      },
      // Add more mock data here
    ];
    this.filteredComplaints = [...this.complaints];
  }

  applyFilters() {
    this.filteredComplaints = this.complaints.filter(complaint => {
      const matchesSearch = complaint.id.toLowerCase().includes(this.filters.search.toLowerCase()) ||
                           complaint.description.toLowerCase().includes(this.filters.search.toLowerCase());
      const matchesStatus = !this.filters.status || complaint.status === this.filters.status;
      const matchesSeverity = !this.filters.severity || complaint.severity === this.filters.severity;

      return matchesSearch && matchesStatus && matchesSeverity;
    });
  }

  getStatusClass(status: string): string {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case "open":
        return `${baseClasses} bg-red-100 text-red-800`;
      case "closed":
        return `${baseClasses} bg-green-100 text-green-800`;
      case "in_progress":
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      default:
        return baseClasses;
    }
  }

  getSeverityClass(severity: string): string {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (severity) {
      case "high":
        return `${baseClasses} bg-red-100 text-red-800`;
      case "medium":
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case "low":
        return `${baseClasses} bg-green-100 text-green-800`;
      default:
        return baseClasses;
    }
  }

  openComplaintModal(complaint: Complaint) {
    this.selectedComplaint = complaint;
  }

  closeComplaintModal() {
    this.selectedComplaint = null;
  }

  exportToCsv() {
    const headers = ["ID", "Date", "Category", "Status", "Severity"];
    const data = this.filteredComplaints.map(c => [
      c.id,
      new Date(c.date).toLocaleDateString(),
      c.category,
      c.status,
      c.severity
    ]);

    const csvContent = [
      headers.join(","),
      ...data.map(row => row.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "complaints.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
