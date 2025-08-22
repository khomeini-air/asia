package com.handys.asia.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.sql.Timestamp;

@Entity
@Table(name = "candidates")
@Getter
@Setter
public class CandidateTask {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "first_name", nullable = false)
    private String firstName;

    @Column(name = "last_name", nullable = false)
    private String lastName;

    @OneToOne
    @JoinColumn(name="task_id", referencedColumnName = "id")
    private Task task;

    @Column(name="duration", nullable = false)
    private Long duration;

    @Column(name="extra_time")
    private Long extraTime;

    @Column(name="delivery_link")
    private String link;

    @CreationTimestamp
    @Column(name = "created_at", columnDefinition = "TIMESTAMP default CURRENT_TIMESTAMP")
    private Timestamp createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", columnDefinition = "TIMESTAMP default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP")
    private Timestamp updatedAt;
}
