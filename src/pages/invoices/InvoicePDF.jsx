import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";


Font.register({
  family: "Roboto",
  fonts: [
    {
      src: "https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Me5Q.ttf",
      fontWeight: "normal",
    },
    {
      src: "https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmWUlvAw.ttf",
      fontWeight: "bold",
    },
  ],
});


const styles = StyleSheet.create({
  page: {
    backgroundColor: "#0f172a",
    padding: 40,
    fontFamily: "Roboto",
  },
  header: {
    marginBottom: 24,
  },
  companyName: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#f59e0b",
    marginBottom: 6,
  },
  label: {
    fontSize: 12,
    color: "#9ca3af",
    marginBottom: 3,
  },
  value: {
    fontSize: 12,
    color: "#ffffff",
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    marginBottom: 6,
    gap: 4,
  },
  billToBox: {
    backgroundColor: "#ffffff10",
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#ffffff20",
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#f59e0b",
    marginBottom: 10,
  },
  clientName: {
    fontSize: 14,
    color: "#ffffff",
    fontWeight: "bold",
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ffffff20",
    paddingBottom: 8,
    marginBottom: 6,
  },
  tableHeaderText: {
    fontSize: 11,
    color: "#9ca3af",
    fontWeight: "bold",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ffffff10",
  },
  tableCell: {
    fontSize: 11,
    color: "#ffffff",
  },
  amberCell: {
    fontSize: 11,
    color: "#f59e0b",
    fontWeight: "bold",
  },
  col1: { flex: 3 },
  col2: { flex: 1, textAlign: "center" },
  col3: { flex: 2, textAlign: "center" },
  col4: { flex: 2, textAlign: "right" },
  totalBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#ffffff15",
    borderRadius: 8,
    padding: 16,
    marginTop: 24,
    borderWidth: 1,
    borderColor: "#ffffff20",
  },
  totalLabel: {
    fontSize: 14,
    color: "#e5e7eb",
    fontWeight: "bold",
  },
  totalAmount: {
    fontSize: 22,
    color: "#f59e0b",
    fontWeight: "bold",
  },
  footer: {
  marginTop: 40,
  paddingTop: 12,
  borderTopWidth: 1,
  borderTopColor: "#ffffff20",
  alignItems: "center",
  gap: 4,
},

footerText: {
  fontSize: 10,
  color: "#9ca3af",
},

footerCompany: {
  fontSize: 11,
  color: "#ffffff",
  fontWeight: "bold",
},

subTotalBox: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  backgroundColor: "#ffffff10",
  borderRadius: 8,
  padding: 14,
  marginTop: 10,
  borderWidth: 1,
  borderColor: "#ffffff20",
},

subTotalLabel: {
  fontSize: 12,
  color: "#e5e7eb",
  fontWeight: "bold",
},

depositAmount: {
  fontSize: 16,
  color: "#38bdf8", // blue-ish
  fontWeight: "bold",
},

balanceAmount: {
  fontSize: 16,
  color: "#f59e0b", // amber
  fontWeight: "bold",
},
  statusPaid: { fontSize: 13, color: "#4ade80", fontWeight: "bold", marginTop: 4 },
  statusPending: { fontSize: 13, color: "#facc15", fontWeight: "bold", marginTop: 4 },
  statusOverdue: { fontSize: 13, color: "#f87171", fontWeight: "bold", marginTop: 4 },
  itemsBox: {
    backgroundColor: "#ffffff08",
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: "#ffffff15",
    marginBottom: 8,
  },
});

export default function InvoicePDF({ invoice }) {
  const totalAmount = invoice.items?.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );

  const statusStyle =
    invoice.status === "Paid"
      ? styles.statusPaid
      : invoice.status === "Pending"
      ? styles.statusPending
      : styles.statusOverdue;

  return (
    <Document>
      <Page size="A4" style={styles.page}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.companyName}>
            {invoice?.companyName || "Your Company"} Invoice
          </Text>
          <View style={styles.row}>
            <Text style={styles.label}>Invoice ID: </Text>
            <Text style={styles.value}>{invoice.id}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Invoice Date: </Text>
            <Text style={styles.value}>{invoice.date}</Text>
          </View>
          <Text style={statusStyle}>{invoice.status}</Text>
        </View>

        {/* Bill To */}
        <View style={styles.billToBox}>
          <Text style={styles.sectionTitle}>Bill To</Text>
          <Text style={styles.clientName}>{invoice.client}</Text>
        </View>

        {/* Items */}
        <View style={styles.itemsBox}>
          <Text style={styles.sectionTitle}>Items</Text>

          {/* Table Header */}
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, styles.col1]}>Item</Text>
            <Text style={[styles.tableHeaderText, styles.col2]}>Qty</Text>
            <Text style={[styles.tableHeaderText, styles.col3]}>Price</Text>
            <Text style={[styles.tableHeaderText, styles.col4]}>Total</Text>
          </View>

          {/* Table Rows */}
          {invoice.items?.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.col1]}>{item.name}</Text>
              <Text style={[styles.tableCell, styles.col2]}>{item.quantity}</Text>
              <Text style={[styles.amberCell, styles.col3]}>
                ₦ {item.price.toLocaleString()}
              </Text>
              <Text style={[styles.amberCell, styles.col4]}>
                ₦ {(item.quantity * item.price).toLocaleString()}
              </Text>
            </View>
          ))}
        </View>

        {/* Total */}
        <View style={styles.totalBox}>
          <Text style={styles.totalLabel}>Total Amount</Text>
          <Text style={styles.totalAmount}>
            ₦ {totalAmount?.toLocaleString()}
          </Text>
        </View>

   {invoice.status !== "Paid" && (
  <>
    {/* Deposit */}
    <View style={styles.subTotalBox}>
      <Text style={styles.subTotalLabel}>Deposit</Text>
      <Text style={styles.depositAmount}>
        ₦ {invoice.deposit?.toLocaleString() || "0"}
      </Text>
    </View>

    {/* Balance */}
    <View style={styles.subTotalBox}>
      <Text style={styles.subTotalLabel}>Balance</Text>
      <Text style={styles.balanceAmount}>
        ₦ {invoice.balance?.toLocaleString() || "0"}
      </Text>
    </View>
  </>
)}

        <View style={{ marginTop: 10 }}>
          <Text style={styles.label}>
             Created By: {invoice.createdBy || "-"}
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerCompany}>
            {invoice.companyName || "Your Company"}
          </Text>
          {invoice.address && (
            <Text style={styles.footerText}>
              Address: {invoice?.address}
            </Text>
          )}
          {invoice.phone && (
            <Text style={styles.footerText}>
              Phone: {invoice?.phone}
            </Text>
          )}
          <Text style={styles.footerText}>
            Thank you for the patronage!
          </Text>
        </View>

      </Page>
    </Document>
  );
}