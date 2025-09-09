import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import '../stylesheets/Profile.css';
const Profile = () => {
  return (
    <div className="bg-light">
      <div className="container py-5">
        <div className="row">
          {/* Profile Header */}
          <div className="col-12 mb-4">
            <div className="profile-header position-relative mb-4">
              <div className="position-absolute top-0 end-0 p-3">
                <button className="btn btn-light">
                  <i className="fas fa-edit me-2"></i>Edit Cover
                </button>
              </div>
            </div>
            <div className="text-center">
              <div className="position-relative d-inline-block">
                <img
                  src="https://randomuser.me/api/portraits/men/40.jpg"
                  className="rounded-circle profile-pic"
                  alt="Profile"
                />
                <button className="btn btn-primary btn-sm position-absolute bottom-0 end-0 rounded-circle">
                  <i className="fas fa-camera"></i>
                </button>
              </div>
              <h3 className="mt-3 mb-1">Alex Johnson</h3>
              <p className="text-muted mb-3">Senior Product Designer</p>
              <div className="d-flex justify-content-center gap-2 mb-4">
                <button className="btn btn-outline-primary">
                  <i className="fas fa-envelope me-2"></i>Message
                </button>
                <button className="btn btn-primary">
                  <i className="fas fa-user-plus me-2"></i>Connect
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-0">
                <div className="row g-0">
                  {/* Sidebar */}
                  <div className="col-lg-3 border-end">
                    <div className="p-4">
                      <div className="nav flex-column nav-pills">
                        <a className="nav-link active" href="#">
                          <i className="fas fa-user me-2"></i>Personal Info
                        </a>
                        <a className="nav-link" href="#">
                          <i className="fas fa-lock me-2"></i>Security
                        </a>
                        <a className="nav-link" href="#">
                          <i className="fas fa-bell me-2"></i>Notifications
                        </a>
                        <a className="nav-link" href="#">
                          <i className="fas fa-credit-card me-2"></i>Billing
                        </a>
                        <a className="nav-link" href="#">
                          <i className="fas fa-chart-line me-2"></i>Activity
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Content Area */}
                  <div className="col-lg-9">
                    <div className="p-4">
                      {/* Personal Information */}
                      <div className="mb-4">
                        <h5 className="mb-4">Personal Information</h5>
                        <div className="row g-3">
                          <div className="col-md-6">
                            <label className="form-label">First Name</label>
                            <input
                              type="text"
                              className="form-control"
                              defaultValue="Alex"
                            />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label">Last Name</label>
                            <input
                              type="text"
                              className="form-control"
                              defaultValue="Johnson"
                            />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label">Email</label>
                            <input
                              type="email"
                              className="form-control"
                              defaultValue="alex.johnson@example.com"
                            />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label">Phone</label>
                            <input
                              type="tel"
                              className="form-control"
                              defaultValue="+1 (555) 123-4567"
                            />
                          </div>
                          <div className="col-12">
                            <label className="form-label">Bio</label>
                            <textarea
                              className="form-control"
                              rows="4"
                              defaultValue="Product designer with 5+ years of experience in creating user-centered digital solutions. Passionate about solving complex problems through simple and elegant designs."
                            ></textarea>
                          </div>
                        </div>
                      </div>

                      {/* Settings Cards */}
                      <div className="row g-4 mb-4">
                        <div className="col-md-6">
                          <div className="settings-card card">
                            <div className="card-body">
                              <div className="d-flex justify-content-between align-items-center">
                                <div>
                                  <h6 className="mb-1">
                                    Two-Factor Authentication
                                  </h6>
                                  <p className="text-muted mb-0 small">
                                    Add an extra layer of security
                                  </p>
                                </div>
                                <div className="form-check form-switch">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    defaultChecked
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="settings-card card">
                            <div className="card-body">
                              <div className="d-flex justify-content-between align-items-center">
                                <div>
                                  <h6 className="mb-1">Email Notifications</h6>
                                  <p className="text-muted mb-0 small">
                                    Receive activity updates
                                  </p>
                                </div>
                                <div className="form-check form-switch">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    defaultChecked
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Recent Activity */}
                      <div>
                        <h5 className="mb-4">Recent Activity</h5>
                        <div className="activity-item mb-3">
                          <h6 className="mb-1">Updated profile picture</h6>
                          <p className="text-muted small mb-0">2 hours ago</p>
                        </div>
                        <div className="activity-item mb-3">
                          <h6 className="mb-1">Changed password</h6>
                          <p className="text-muted small mb-0">Yesterday</p>
                        </div>
                        <div className="activity-item">
                          <h6 className="mb-1">Updated billing information</h6>
                          <p className="text-muted small mb-0">3 days ago</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* End Content */}
                </div>
              </div>
            </div>
          </div>
          {/* End Main Content */}
        </div>
      </div>
    </div>
  );
};

export default Profile;
